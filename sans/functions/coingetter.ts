import { DefineFunction, SlackFunction, Schema } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";

export const getterCoins = DefineFunction({
  callback_id: "coinsgetter",
  title: "User Coins",
  description: "How many coins?",
  source_file: "functions/coingetter.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
        description: "To pass to the next step",
      }
    },
    required: ["user_id", "interactivity"],
  },
  output_parameters: {
    properties: {
      num: {
        type: Schema.types.number,
        description: "Amount of coins",
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
        description: "The user invoking the workflow",
      }
    },
    required: ["num", "interactivity"],
  }
});

export default SlackFunction(
  getterCoins,
  async ({ inputs, client }) => {
    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: inputs.user_id,
    });

    if (getResp.item.coins) {
      return { outputs: { num: getResp.item.coins, interactivity: inputs.interactivity } };
    } else {
      return { outputs: { num: 0, interactivity: inputs.interactivity } };
    }
  },
);
