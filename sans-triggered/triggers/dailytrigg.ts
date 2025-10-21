import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import the from "../workflows/dailyupdate.ts";

const sampleTrigger: Trigger<typeof the.definition> = {
  type: TriggerTypes.Scheduled,
  name: "thetrigger",
  description: "Runs every day",
  workflow: `#/workflows/${the.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: `${2025}-${10}-${21}T20:30:00`,
    end_time: "2050-05-01T14:00:00Z",
    timezone: "America/Los_Angeles",
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default sampleTrigger;
