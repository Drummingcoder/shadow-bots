import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { theMessage } from "../../extra/message copy.ts";
import { check } from "../../extra/message copy.ts";
import { channelCheck } from "../../extra/message copy.ts";

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

const step = exposeChannels.addStep(check, {
  message: exposeChannels.inputs.message,
});

if (step.outputs.strin == "Specific") {
  exposeChannels.addStep(Schema.slack.functions.SendMessage, {
    channel_id: exposeChannels.inputs.channel,
    message: "Checking...",
  });
  exposeChannels.addStep(channelCheck, {
    message: exposeChannels.inputs.message,
    channel_id: exposeChannels.inputs.channel,
  });
} else {
  exposeChannels.addStep(Schema.slack.functions.SendMessage, {
    channel_id: exposeChannels.inputs.channel,
    message: "Looking for the channels the target is in...",
  });
  exposeChannels.addStep(theMessage, {
    message: exposeChannels.inputs.message,
  });
  exposeChannels.addStep(Schema.slack.functions.SendMessage, {
    channel_id: exposeChannels.inputs.channel,
    message: "Done!",
  });
}

export default exposeChannels;
