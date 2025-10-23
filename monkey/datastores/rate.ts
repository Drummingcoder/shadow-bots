import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const letsnotgo = DefineDatastore({
  name: "mememem",
  primary_key: "therate",
  attributes: {
    therate: {
      type: Schema.types.string,
    },
    limited: {
      type: Schema.types.boolean,
    },
    count: {
      type: Schema.types.number,
    }
  },
});

export default letsnotgo;
