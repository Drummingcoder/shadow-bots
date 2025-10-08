import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { doit } from "../functions/runner.ts";

const nextMove = DefineWorkflow({
  callback_id: "moveoner",
  title: "Mover",
  description: "Advances the game",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      message: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      threadts: {
        type: Schema.types.string,
      },
    },
    required: ["channel", "message", "user", "threadts"],
  },
});

nextMove.addStep(doit, {
  message: nextMove.inputs.message,
  channel: nextMove.inputs.channel,
  threadts: nextMove.inputs.threadts,
  user_id: nextMove.inputs.user,
});

export default nextMove;
