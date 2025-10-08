import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const multi = DefineDatastore({
  name: "multistore",
  primary_key: "game",
  attributes: {
    game: {
      type: Schema.types.string,
    },
    player1: {
      type: Schema.slack.types.user_id,
    },
    player2: {
      type: Schema.slack.types.user_id,
    },
    messageinput: {
      type: Schema.types.string,
    },
    score: {
      type: Schema.types.number,
    },
    finished: {
      type: Schema.types.boolean,
    },
    listofinputs: {
      type: Schema.types.array,
    },
    turn: {
      type: Schema.types.number,
    }
  },
});

export default multi;
