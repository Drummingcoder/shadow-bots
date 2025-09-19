import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import annoy from "../workflows/annoy_go.ts";

const myTrigger: Trigger<typeof annoy.definition> = {
  type: TriggerTypes.Event,
  name: "New Message",
  description: "A trigger that fires when a new message is posted",
  workflow: `#/workflows/${annoy.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    all_resources: true,
    filter: {
      version: 1,
      root: {
        operator: "NOT",
        inputs: [{
          statement: "{{data.user_id}} == null",
        }],
      }
    },
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    timestamp: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
    user: {
      value: TriggerContextData.Event.MessagePosted.user_id,
    },
  },
};

export default myTrigger;
