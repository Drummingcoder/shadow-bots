import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const games = DefineDatastore({
  name: "game_inputs",
  primary_key: "number",
  attributes: {
    number: {
      type: Schema.types.string,
    },
    player1: {
      type: Schema.slack.types.user_id,
    },
    p1input: {
      type: Schema.types.string,
    },
    player2: {
      type: Schema.slack.types.user_id,
    },
    p2input: {
      type: Schema.types.string,
    },
    finished: {
      type: Schema.types.boolean,
    }
  },
});

export default games;
