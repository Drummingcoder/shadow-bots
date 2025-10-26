import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { comeonseeya } from "../functions/continue.ts";

const keepgoing = DefineWorkflow({
  callback_id: "theminute",
  title: "Every minute",
  description: "This will trigger",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

keepgoing.addStep(comeonseeya, {});

export default keepgoing;
