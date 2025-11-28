import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { othersend } from "../functions/sendmessage.ts";

const letsmakethe = DefineWorkflow({
  callback_id: "letsgoremind",
  title: "Run the daily",
  description: "Posts to channel",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      apikey: {
        type: Schema.types.string,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["user"],
  },
});

letsmakethe.addStep(othersend, {
  user: letsmakethe.inputs.user,
  apikey: letsmakethe.inputs.apikey,
  channel: letsmakethe.inputs.channel_id,
});

export default letsmakethe;
