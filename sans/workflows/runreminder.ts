import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { mymessagedaily } from "../functions/createmessage.ts";

const letsmakethe = DefineWorkflow({
  callback_id: "letsgoremind",
  title: "Run the daily",
  description: "Posts to channel",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      }
    },
    required: ["user", "interactivity"],
  },
});

letsmakethe.addStep(mymessagedaily, {
  user: domake.inputs.user,
});

export default letsmakethe;
