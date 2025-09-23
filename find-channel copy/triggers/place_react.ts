import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import annoyReacter from "../workflows/annoy.ts";

const newTrigger: Trigger<typeof annoyReacter.definition> = {
  type: TriggerTypes.Shortcut,
  name: "annoy-emoji",
  description: "React to someone's message all the time!",
  workflow: `#/workflows/${annoyReacter.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default newTrigger;
