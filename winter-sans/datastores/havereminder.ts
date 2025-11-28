import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const remindchecker = DefineDatastore({
  name: "nodupreminds",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    havereminder: {
      type: Schema.types.boolean,
    },
  },
});

export default remindchecker;
