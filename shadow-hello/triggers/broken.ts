import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes, TriggerContextData } from "deno-slack-api/mod.ts";
import { ShadowHello } from "../workflows/welcome.ts";

const greetingTrigger: Trigger<typeof ShadowHello.definition> = {
  type: TriggerTypes.Event,
  name: "Welcome Trigger",
  description: "Starts when someone joins a channel",
  workflow: `#/workflows/${ShadowHello.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.UserJoinedChannel,
    channel_ids: ["C09AHN6V1U7"],
    filter: {
      version: 1,
      root: {
        statement: "{{data.reaction}} == sunglasses"
      }
    }
  },
  inputs: {
    interactivity: {
      value: TriggerContextData.Event.interactivity,
    },
    new_member: {
      value: TriggerContextData.Event.user_id,
    },
  },
};

export default greetingTrigger;