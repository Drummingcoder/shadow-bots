import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { messenger } from "../functions/messger.ts";

const responder = DefineWorkflow({
  callback_id: "respondDM",
  title: "Texter",
  description: "When DMed, respond with a message",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      message: {
        type: Schema.types.string,
      },
      threadts: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["user", "message", "channel"],
  },
});

responder.addStep(messenger, {
  channel: responder.inputs.channel,
  message: responder.inputs.message,
  user: responder.inputs.user,
  messagets: responder.inputs.threadts,
});

export default responder;
