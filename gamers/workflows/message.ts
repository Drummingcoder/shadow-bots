import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { channelCheck } from "../functions/check_channel.ts";

const updater = DefineWorkflow({
  callback_id: "talk_to_user",
  title: "Dokeshi Talks",
  description: "Interact with the bot to find out more about it",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      message: {
        type: Schema.types.string,
      },
      timestamp: {
        type: Schema.types.string,
      }
    },
    required: ["channel", "message", "timestamp"],
  },
});

updater.addStep(channelCheck, {
  message: updater.inputs.message,
  channel_id: updater.inputs.channel,
  timestamp: updater.inputs.timestamp,
});

export default updater;
