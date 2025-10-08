import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import nextMove from "../workflows/moveon.ts";

const sampleTrigger: Trigger<typeof nextMove.definition> = {
  type: TriggerTypes.Event,
  name: "New Input",
  description: "A trigger to respond to next move",
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
  workflow: `#/workflows/${nextMove.definition.callback_id}`,
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
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
  },
};

export default sampleTrigger;
