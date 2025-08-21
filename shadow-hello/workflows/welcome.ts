// workflows/give_kudos.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { welcomeMessage } from "../functions/message.ts";

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
    submit_label: "Share",
    description: "Continue the positive energy through your written word",
    fields: {
      elements: [{
        name: "new_member",
        title: "Who to say hello to?",
        description: "They will get a warm welcome!",
        type: Schema.slack.types.user_id,
      },
      channel: {
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

const blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: welcomeMessageStep.outputs.message,
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Wave Hello",
        },
        action_id: "wave_button",
        value: "wave_clicked",
      },
    ],
  },
];

const outputChannel1 = ShadowHello.addStep(Schema.slack.functions.SendMessage, {
  channel_id: initialMessage.outputs.fields.channel,
  blocks: JSON.stringify(blocks),
});

export { ShadowHello };