import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const trackUsers = DefineDatastore({
  name: "users",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    tracking: {
      type: Schema.types.boolean,
    },
    step: {
      type: Schema.types.number,
    },
    coins: {
      type: Schema.types.number,
    },
    messagets: {
      type: Schema.types.string,
    }
  },
});

export default trackUsers;
