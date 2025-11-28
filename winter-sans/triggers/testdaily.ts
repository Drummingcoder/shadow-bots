import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import testremind from "../workflows/testreminder.ts";

const myTrigger: Trigger<typeof testremind.definition> = {
  type: TriggerTypes.Shortcut,
  name: "testmydaily",
  description: "For development purposes only",
  workflow: `#/workflows/${testremind.definition.callback_id}`,
  inputs: {
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    }
  },
};

export default myTrigger;
