import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { pingchecker } from "../functions/pingme.ts";

const messandreact = DefineWorkflow({
  callback_id: "todaywhat",
  title: "What Happened Today",
  description: "Check message count and reaction count",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

messandreact.addStep(pingchecker, {});

export default messandreact;
