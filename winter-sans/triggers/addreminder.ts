import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import domake from "../workflows/createreminder.ts";

const myTrigger: Trigger<typeof domake.definition> = {
  type: TriggerTypes.Shortcut,
  name: "createdaily",
  description: "Create a detailed daily reminder in your channel",
  workflow: `#/workflows/${domake.definition.callback_id}`,
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
