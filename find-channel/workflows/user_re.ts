import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { theMessage } from "../functions/loop_user.ts";

const exposeChannels1 = DefineWorkflow({
  callback_id: "expose_channels_re",
  title: "Expose Channels 1",
  description: "Know all public channels that the target is in",
  input_parameters: {
    properties: {
      place_var: {
        type: Schema.types.object,
      },
      cursor: {
        type: Schema.types.string,
      },
      target_id: {
        type: Schema.types.string,
      },
      target_channel: {
        type: Schema.types.string,
      },
      post_channel: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["place_var", "cursor", "target_id", "target_channel"],
  },
});

exposeChannels1.addStep(theMessage, {
  place_var: exposeChannels1.inputs.place_var,
  cursor: exposeChannels1.inputs.cursor,
  target_id: exposeChannels1.inputs.target_id,
  target_channel: exposeChannels1.inputs.target_channel,
  post_channel: exposeChannels1.inputs.post_channel,
});

export default exposeChannels1;