import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { theMessage } from "../functions/get_message.ts";

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
    },
    required: ["channel", "message"],
  },
});

exposeChannels.addStep(theMessage, {
  message: exposeChannels.inputs.message,
});

export default exposeChannels;
