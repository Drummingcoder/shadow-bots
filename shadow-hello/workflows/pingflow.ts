import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { pingMe } from "../functions/ping_me.ts";

export const PingResponse = DefineWorkflow({
  callback_id: "ping_response",
  title: "Ping Response Workflow",
  description: "Handle ping button clicks",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

PingResponse.addStep(pingMe, {
  interactivity: PingResponse.inputs.interactivity,
});