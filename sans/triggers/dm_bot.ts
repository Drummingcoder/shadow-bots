import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import responder from "../workflows/dmflow.ts";

const sampleTrigger: Trigger<typeof responder.definition> = {
  type: TriggerTypes.Event,
  name: "DM Responder",
  description: "A trigger that responds to DMs",
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    all_resources: true,
    filter: {
      version: 1,
      root: {
        operator: "AND",
        inputs: [{
          statement: "{{data.user_id}} != null",
        },
        {
          statement: "{{data.channel_id}} != 'C09FQS5HRHS'"
        },],
      }
    },
  },
  workflow: `#/workflows/${responder.definition.callback_id}`,
  inputs: {
    user: {
      value: TriggerContextData.Event.MessagePosted.user_id,
    },
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    },
    channel: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    threadts: {
      value: TriggerContextData.Event.MessagePosted.thread_ts,
    },
  },
};

export default sampleTrigger;
