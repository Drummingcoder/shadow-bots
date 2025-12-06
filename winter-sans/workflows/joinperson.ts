import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { newmessenger } from "../functions/welcome.ts";

const second = DefineWorkflow({
  callback_id: "firstjoin",
  title: "Someone joined",
  description: "Who joined?",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      inviter: {
        type: Schema.slack.types.user_id,
        default: "",
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["user", "channel"],
  },
});

second.addStep(newmessenger, {
  channel: second.inputs.channel,
  user: second.inputs.user,
  inviter: second.inputs.inviter,
});

export default second;
