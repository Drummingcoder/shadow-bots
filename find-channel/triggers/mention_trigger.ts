import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import exposeChannels from "../workflows/message.ts";

const myTrigger: Trigger<typeof exposeChannels.definition> = {
  type: TriggerTypes.Event,
  name: "Mention Me",
  description: "A trigger that fires when the bot is mentioned",
  workflow: `#/workflows/${exposeChannels.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.AppMentioned,
    channel_ids: ["C09AHN6V1U7", "C08SKC6P85V"],
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.AppMentioned.channel_id,
    },
    message: {
      value: TriggerContextData.Event.AppMentioned.text,
    },
  },
};

export default myTrigger;
