import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import startDeath from "../workflows/deathby.ts";

const newTrigger: Trigger<typeof startDeath.definition> = {
  type: TriggerTypes.Shortcut,
  name: "deathrespond",
  description: "Response for a game",
  workflow: `#/workflows/${startDeath.definition.callback_id}`,
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
