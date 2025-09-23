import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { check } from "../functions/check_step.ts";
import { channelCheck } from "../functions/check_channel.ts";

const exposeChannels = DefineWorkflow({
  callback_id: "expose_channels",
  title: "Expose Channels",
  description: "Know all public channels that the target is in",
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

const _step = exposeChannels.addStep(check, {
  message: exposeChannels.inputs.message,
});

exposeChannels.addStep(channelCheck, {
  message: exposeChannels.inputs.message,
  channel_id: exposeChannels.inputs.channel,
  timestamp: exposeChannels.inputs.timestamp,
});


export default exposeChannels;
