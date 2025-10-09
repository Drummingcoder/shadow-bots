import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import getDeath from "../workflows/getpeople.ts";

const sampleTrigger: Trigger<typeof getDeath.definition> = {
  type: TriggerTypes.Event,
  name: "New Person",
  description: "A trigger to accept a new person",
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
  workflow: `#/workflows/${getDeath.definition.callback_id}`,
  inputs: {
    user: {
      value: TriggerContextData.Event.MessagePosted.user_id,
    },
    messagets: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
    channel: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    threadts: {
      value: TriggerContextData.Event.MessagePosted.thread_ts,
    },
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    }
  },
};

export default sampleTrigger;
