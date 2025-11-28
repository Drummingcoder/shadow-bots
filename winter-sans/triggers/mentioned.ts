import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import first from "../workflows/onboarding.ts";

const myTrigger: Trigger<typeof first.definition> = {
  type: TriggerTypes.Event,
  name: "Mentiond",
  description: "A trigger that fires when the bot is mentioned",
  workflow: `#/workflows/${first.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.AppMentioned,
    all_resources: true,
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.AppMentioned.channel_id,
    },
    message: {
      value: TriggerContextData.Event.AppMentioned.text,
    },
    user: {
      value: TriggerContextData.Event.AppMentioned.user_id,
    },
    messagets: {
      value: TriggerContextData.Event.AppMentioned.message_ts,
    },
  },
};

export default myTrigger;
