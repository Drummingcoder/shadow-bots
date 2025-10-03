import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const minusCoins = DefineDatastore({
  name: "coinremove",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    coins: {
      type: Schema.types.number,
    },
  },
});

export default minusCoins;
