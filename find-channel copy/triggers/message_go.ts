import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import anonMes from "../workflows/anon_message.ts";

const newTrigger: Trigger<typeof anonMes.definition> = {
  type: TriggerTypes.Shortcut,
  name: "bot-message",
  description: "Need to bot message or reply?",
  workflow: `#/workflows/${anonMes.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default newTrigger;
