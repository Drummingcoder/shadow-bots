import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { welcomeMessage } from "../functions/message.ts";
import { getImage } from "../functions/get_image_function.ts";
import { blockMessage } from "../functions/block.ts";
import { pingMe } from "../functions/ping_me.ts";

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
  interactivity: initialMessage.outputs.interactivity,
});

const image = ShadowHello.addStep(getImage, {
  new_member: initialMessage.outputs.fields.new_member,
  interactivity: welcomeMessageStep.outputs.interactivity,
});

const outputChannel1 = ShadowHello.addStep(blockMessage, {
  channel_id: initialMessage.outputs.fields.channel,
  message: welcomeMessageStep.outputs.message,
  image_url: image.outputs.image_url,
  interactivity: image.outputs.interactivity,
});

export { ShadowHello };