import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const emojiuser = DefineDatastore({
  name: "user_emoji",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    emoji: {
      type: Schema.types.string,
    },
  },
});

export default emojiuser;
