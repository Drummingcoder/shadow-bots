import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import checke from "../workflows/pingandcheck.ts";

const sampleTrigger: Trigger<typeof checke.definition> = {
  type: TriggerTypes.Event,
  name: "Check and run",
  description: "A trigger that responds to DMs",
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    all_resources: true,
    filter: {
      version: 1,
      root: {
        operator: "AND",
        inputs: [{
          statement: "{{data.channel_id}} == 'C09UCPKMXJN'",
        },
      ],
      }
    },
  },
  workflow: `#/workflows/${checke.definition.callback_id}`,
  inputs: {
  },
};

export default sampleTrigger;
