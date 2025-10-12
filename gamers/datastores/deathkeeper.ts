import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const yourDeath = DefineDatastore({
  name: "dearep",
  primary_key: "number",
  attributes: {
    number: {
      type: Schema.types.string,
    },
    player1rep: {
      type: Schema.types.string,
    },
    player1ans: {
      type: Schema.types.string,
    },
    player2rep: {
      type: Schema.types.string,
    },
    player2ans: {
      type: Schema.types.string,
    },
    player3rep: {
      type: Schema.types.string,
    },
    player3ans: {
      type: Schema.types.string,
    },
    player4rep: {
      type: Schema.types.string,
    },
    player4ans: {
      type: Schema.types.string,
    },
    player5rep: {
      type: Schema.types.string,
    },
    player5ans: {
      type: Schema.types.string,
    },
    player6rep: {
      type: Schema.types.string,
    },
    player6ans: {
      type: Schema.types.string,
    },
    player7rep: {
      type: Schema.types.string,
    },
    player7ans: {
      type: Schema.types.string,
    },
    player8rep: {
      type: Schema.types.string,
    },
    player8ans: {
      type: Schema.types.string,
    },
    player9rep: {
      type: Schema.types.string,
    },
    player9ans: {
      type: Schema.types.string,
    },
    player10rep: {
      type: Schema.types.string,
    },
    player10ans: {
      type: Schema.types.string,
    },
  },
});

export default yourDeath;
