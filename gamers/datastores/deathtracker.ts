import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const myDeath = DefineDatastore({
  name: "deathdata",
  primary_key: "number",
  attributes: {
    number: {
      type: Schema.types.string,
    },
    ts: {
      type: Schema.types.string,
    },
    player1: {
      type: Schema.slack.types.user_id,
    },
    p1score: {
      type: Schema.types.number,
    },
    player2: {
      type: Schema.slack.types.user_id,
    },
    p2score: {
      type: Schema.types.number,
    },
    player3: {
      type: Schema.slack.types.user_id,
    },
    p3score: {
      type: Schema.types.number,
    },
    player4: {
      type: Schema.slack.types.user_id,
    },
    p4score: {
      type: Schema.types.number,
    },
    player5: {
      type: Schema.slack.types.user_id,
    },
    p5score: {
      type: Schema.types.number,
    },
    player6: {
      type: Schema.slack.types.user_id,
    },
    p6score: {
      type: Schema.types.number,
    },
    player7: {
      type: Schema.slack.types.user_id,
    },
    p7score: {
      type: Schema.types.number,
    },
    player8: {
      type: Schema.slack.types.user_id,
    },
    p8score: {
      type: Schema.types.number,
    },
    player9: {
      type: Schema.slack.types.user_id,
    },
    p9score: {
      type: Schema.types.number,
    },
    player10: {
      type: Schema.slack.types.user_id,
    },
    p10score: {
      type: Schema.types.number,
    },
    playersEntered: {
      type: Schema.types.number,
    },
    numofinputs: {
      type: Schema.types.number,
    },
    round: {
      type: Schema.types.number,
    },
    finished: {
      type: Schema.types.boolean,
    }
  },
});

export default myDeath;
