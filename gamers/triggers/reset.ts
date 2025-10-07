import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import startOmni from "../workflows/startOmniGame.ts";

const newTrigger: Trigger<typeof startOmni.definition> = {
  type: TriggerTypes.Shortcut,
  name: "playOmniRPS",
  description: "Rock, Paper, Scissors, but you can use anything",
  workflow: `#/workflows/${startOmni.definition.callback_id}`,
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
