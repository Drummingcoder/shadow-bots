import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import anonReact from "../workflows/anon_emoji.ts";

const myTrigger: Trigger<typeof anonReact.definition> = {
  type: TriggerTypes.Shortcut,
  name: "anon-emoji",
  description: "Anonymously react to a message",
  workflow: `#/workflows/${anonReact.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default myTrigger;
