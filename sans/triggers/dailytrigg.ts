import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import messandreact from "../workflows/dailyupdate.ts";

const sampleTrigger: Trigger<typeof messandreact.definition> = {
  type: TriggerTypes.Scheduled,
  name: "thetrigger",
  description: "Runs every day",
  workflow: `#/workflows/${messandreact.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: `${2025}-${10}-${23}T20:30:00`,
    end_time: "2050-05-01T14:00:00Z",
    timezone: "America/Los_Angeles",
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default sampleTrigger;
