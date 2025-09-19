import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { goannoy } from "../functions/reactannoy.ts";

const annoy = DefineWorkflow({
  callback_id: "annoy_user_pls",
  title: "React Anonymously to Annoy User",
  description: "All messages of a user will be reacted to!",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      timestamp: {
        type: Schema.types.string,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["channel", "timestamp", "user"],
  },
});

annoy.addStep(goannoy, {
  channel_id: annoy.inputs.channel,
  timestamp: annoy.inputs.timestamp,
  user_id: annoy.inputs.user,
});

export default annoy;
