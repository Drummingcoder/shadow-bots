import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { counter } from "../functions/coin.ts";

const checked = DefineWorkflow({
  callback_id: "givemecoin",
  title: "Coin Giver",
  description: "Resets database and gives coins",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

checked.addStep(counter, {});

export default checked;
