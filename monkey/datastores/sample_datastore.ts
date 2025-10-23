import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const letsgo = DefineDatastore({
  name: "SampleObjects",
  primary_key: "number",
  attributes: {
    number: {
      type: Schema.types.string,
    },
    user: {
      type: Schema.types.string,
    },
    cursor: {
      type: Schema.types.string,
    },
    ongoing: {
      type: Schema.types.boolean,
    }
  },
});

export default letsgo;
