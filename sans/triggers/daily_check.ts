import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import checked from "../workflows/coincounter.ts";

const sampleTrigger: Trigger<typeof checked.definition> = {
  type: TriggerTypes.Scheduled,
  name: "CheckCoins",
  description: "Runs every day",
  workflow: `#/workflows/${checked.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: `2025-10-03T00:00:00`,
    end_time: "2050-05-01T14:00:00Z",
    timezone: "America/Los_Angeles",
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default sampleTrigger;
