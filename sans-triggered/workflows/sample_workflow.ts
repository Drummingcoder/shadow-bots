import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const SampleWorkflow = DefineWorkflow({
  callback_id: "sample_workflow",
  title: "Sample workflow",
  description: "A sample workflow",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

SampleWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: "C09FQS5HRHS",
    message: "Time to run Sans",
  },
);

export default SampleWorkflow;
