import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const theonechecker = DefineDatastore({
  name: "threadtoresponse",
  primary_key: "threadts",
  attributes: {
    threadts: {
      type: Schema.types.string,
    },
    responded: {
      type: Schema.types.boolean,
    },
  },
});

export default theonechecker;
