// workflows/give_kudos.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { welcomeMessage } from "../functions/message.ts";
import { getImage } from "../functions/get_image.ts";

const ShadowHello = DefineWorkflow({
  callback_id: "shadow_hello",
  title: "Shadow Hello",
  description: "Warmly welcome a new member of the channel",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

const initialMessage = ShadowHello.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Welcome a new member",
    interactivity: ShadowHello.inputs.interactivity,
    submit_label: "Welcome them!",
    description: "Shadowlight's Welcome App",
    fields: {
      elements: [{
        name: "new_member",
        title: "Who to say hello to?",
        description: "They will get a warm welcome!",
        type: Schema.slack.types.user_id,
      },
      {
        name: "channel",
        title: "What channel?",
        description: "This will get the welcome!",
        type: Schema.slack.types.channel_id,
      }],
      required: ["new_member", "channel"],
    },
  },
);

const welcomeMessageStep = ShadowHello.addStep(welcomeMessage, {
  new_member: initialMessage.outputs.fields.new_member,
});

const _outputChannel1 = ShadowHello.addStep(Schema.slack.functions.SendMessage, {
  channel_id: initialMessage.outputs.fields.channel,
  message: " ",
  interactive_blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: welcomeMessageStep.outputs.message,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Wave Hello",
        },
        action_id: "wave_button",
        value: "wave_clicked",
      }
    }
  ],
});

const image = ShadowHello.addStep(getImage, {
  new_member: initialMessage.outputs.fields.new_member,
});

ShadowHello.addStep(Schema.slack.functions.SendMessage, {
  channel_id: initialMessage.outputs.fields.channel,
  message: " ",
  interactive_blocks: [
    {
      type: "image",
      image_url: image.outputs.image_url,
      alt_text: "Sorry, it didn't work!",
    },
  ],
});

export { ShadowHello };