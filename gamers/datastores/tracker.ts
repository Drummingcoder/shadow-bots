import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const game = DefineDatastore({
  name: "game_var",
  primary_key: "name",
  attributes: {
    name: {
      type: Schema.types.string,
    },
    value: {
      type: Schema.types.number,
    },
  },
});

export default game;
