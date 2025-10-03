import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { getterCoins } from "../functions/coingetter.ts";
import { spenderCoins } from "../functions/coinspender.ts";

const spent = DefineWorkflow({
  callback_id: "takemycoins",
  title: "Coin Spender",
  description: "Resets database and gives coins",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      }
    },
    required: ["user", "interactivity"],
  },
});

const coins = spent.addStep(getterCoins, {
  user_id: spent.inputs.user,
  interactivity: spent.inputs.interactivity,
});

const form = spent.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Spend Your Coins",
    interactivity: coins.outputs.interactivity,
    submit_label: "Spend!",
    description: `Need to avoid some pings? You have ${coins.outputs.num} coins`,
    fields: {
      elements: [
      {
        name: "coinsspent",
        title: "How much to spend?",
        description: "1 coin to skip 1 ping after all",
        type: Schema.types.number,
      },
    ],
      required: ["coinsspent"],
    },
  },
);

spent.addStep(spenderCoins, {
  user_id: spent.inputs.user,
  coins: form.outputs.fields.coinsspent,
});

export default spent;
