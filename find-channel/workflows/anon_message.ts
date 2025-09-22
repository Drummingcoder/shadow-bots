import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { mesFunct } from "../functions/reply.ts";

const anonMes = DefineWorkflow({
  callback_id: "anon_mess",
  title: "Anonymous Messaging",
  description: "Anonymously message or reply to a thread",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
      }
    },
    required: ["interactivity"],
  },
});

const form = anonMes.addStep(Schema.slack.functions.OpenForm,
  {
      title: "Anonymous Message",
      interactivity: anonMes.inputs.interactivity,
      submit_label: "Send anonymously!",
      description: "Anonymously message or reply to a thread",
      fields: {
        elements: [
        {
          name: "Message",
          title: "What message to send?",
          description: "Please provide the message text only, more will be added as the bot evolves",
          type: Schema.types.string,
        },
        {
          name: "link",
          title: "What message to reply to?",
          description: "Leave blank to post in channel",
          type: Schema.types.string,
        }
      ],
        required: ["Message"],
      },
    },
);

anonMes.addStep(mesFunct, {
  message: form.outputs.fields.Message,
  channel: anonMes.inputs.channel_id,
  user_id: anonMes.inputs.user_id,
  reply_link: form.outputs.fields.link,
});

export default anonMes;
