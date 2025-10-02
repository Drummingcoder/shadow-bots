import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SampleWorkflow from "../workflows/sample_workflow.ts";

const sampleTrigger: Trigger<typeof SampleWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Trigger60",
  description: "Runs every minute",
  workflow: `#/workflows/${SampleWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: `${2025}-${10}-${2}T11:59:00`,
    end_time: "2050-05-01T14:00:00Z",
    timezone: "America/Los_Angeles",
    frequency: {
      type: "hourly",
      repeats_every: 1,
    },
  },
};

export default sampleTrigger;
