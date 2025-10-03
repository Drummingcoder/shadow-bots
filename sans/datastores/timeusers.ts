import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const usertime = DefineDatastore({
  name: "timerUsers",
  primary_key: "number",
  attributes: {
    number: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    timeOnline: {
      type: Schema.types.number,
    },
    timeOffline: {
      type: Schema.types.number,
    }
  },
});

export default usertime;
