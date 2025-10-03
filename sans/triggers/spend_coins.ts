import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import spent from "../workflows/spender.ts";

const myTrigger: Trigger<typeof spent.definition> = {
  type: TriggerTypes.Shortcut,
  name: "timetospend",
  description: "Time to cash in",
  workflow: `#/workflows/${spent.definition.callback_id}`,
  inputs: {
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    }
  },
};

export default myTrigger;
