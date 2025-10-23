import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SampleFunctionDefinition } from "../functions/sample_function.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
const SampleWorkflow = DefineWorkflow({
  callback_id: "sample_workflow",
  title: "Sample workflow",
  description: "A sample workflow",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
      messagets: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["message", "messagets", "channel", "user"],
  },
});

SampleWorkflow.addStep(SampleFunctionDefinition, {
  message: SampleWorkflow.inputs.message,
  user: SampleWorkflow.inputs.user,
  channel: SampleWorkflow.inputs.channel,
  messagets: SampleWorkflow.inputs.messagets,
});

export default SampleWorkflow;
