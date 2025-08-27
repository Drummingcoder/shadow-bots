import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { PingResponse } from "../workflows/pingflow.ts";

const pingTrigger: Trigger<typeof PingResponse.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Ping Response",
  description: "Respond to ping button",
  workflow: "#/workflows/ping_response",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default pingTrigger;