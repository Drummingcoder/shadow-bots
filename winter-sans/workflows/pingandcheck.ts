import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { pingchecker } from "../functions/pingme.ts";

const checke = DefineWorkflow({
  callback_id: "plshelp",
  title: "Textering",
  description: "Check times and ping if necessary",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

checke.addStep(pingchecker, {});

export default checke;
