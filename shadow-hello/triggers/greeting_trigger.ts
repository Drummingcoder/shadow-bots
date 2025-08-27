import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { ShadowHello } from "../workflows/welcome.ts";

const greetingTrigger: Trigger<typeof ShadowHello.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Send a greeting",
  description: "Send greeting to channel",
  workflow: `#/workflows/${ShadowHello.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default greetingTrigger;