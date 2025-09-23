import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import starting from "../workflows/start_game.ts";

const newTrigger: Trigger<typeof starting.definition> = {
  type: TriggerTypes.Shortcut,
  name: "playOmniRPS",
  description: "RPS, but you can use anything",
  workflow: `#/workflows/${starting.definition.callback_id}`,
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
