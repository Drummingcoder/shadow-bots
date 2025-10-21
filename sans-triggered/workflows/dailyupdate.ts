import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const the = DefineWorkflow({
  callback_id: "daily",
  title: "The daily update",
  description: "A sample workflow",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

the.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: "C09J25VQ7V5",
    message: "Let's talk about this.",
  },
);

export default the;
