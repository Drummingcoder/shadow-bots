import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { theMessage } from "../functions/get_message.ts";

const exposeChannels1 = DefineWorkflow({
  callback_id: "expose_channels_re",
  title: "Expose Channels 1",
  description: "Know all public channels that the target is in",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
      cursor: {
        type: Schema.types.string,
      }
    },
    required: ["message", "cursor"],
  },
});

exposeChannels1.addStep(theMessage, {
  message: exposeChannels1.inputs.message,
});

export default exposeChannels1;
