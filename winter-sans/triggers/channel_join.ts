import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import second from "../workflows/joinperson.ts";

const joined: Trigger<typeof second.definition> = {
  type: TriggerTypes.Event,
  name: "join-chan",
  description: "A trigger that fires when someone joins the channel",
  workflow: `#/workflows/${second.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.UserJoinedChannel,
    channel_ids: ["C09AHN6V1U7"],
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.UserJoinedChannel.channel_id,
    },
    user: {
      value: TriggerContextData.Event.UserJoinedChannel.user_id,
    },
    inviter: {
      value: TriggerContextData.Event.UserJoinedChannel.inviter_id,
    },
  },
};

export default joined;
