import { DefineFunction, SlackFunction, Schema } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import minusCoins from "../datastores/coinusers.ts";

export const spenderCoins = DefineFunction({
  callback_id: "coinssetter",
  title: "Subtract coins",
  description: "A function to remove coins",
  source_file: "functions/coinspender.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      coins: {
        type: Schema.types.number,
        description: "Amount of coins to remove"
      }
    },
    required: [],
  },
});

export default SlackFunction(
  spenderCoins,
  async ({ inputs, client }) => {
    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: inputs.user_id,
    });

    if (inputs.coins) {
      if (inputs.coins > getResp.item.coins) {
        if (inputs.user_id) {
          await client.chat.postMessage({
            channel: inputs.user_id,
            text: "You can't spend coins you don't have."
          });
        }
        return { outputs: {} };
      }

      const getResp1 = await client.apps.datastore.get<
        typeof minusCoins.definition
      >({
        datastore: minusCoins.name,
        id: inputs.user_id,
      });
      let preCoins = 0;
      if (getResp1.item.coins) {
        preCoins = getResp1.item.coins;
      }
      const putResp1 = await client.apps.datastore.put<
        typeof minusCoins.definition
      >({
        datastore: minusCoins.name,
        item: {
          user_id: inputs.user_id,
          coins: (preCoins + inputs.coins),
        },
      });
      console.log(putResp1);

      const getResp2 = await client.apps.datastore.get<
        typeof trackUsers.definition
      >({
        datastore: trackUsers.name,
        id: inputs.user_id,
      });
      let preCoins2 = 0;
      if (getResp2.item.coins) {
        preCoins2 = getResp2.item.coins;
      }
      const putResp2 = await client.apps.datastore.put<
        typeof trackUsers.definition
      >({
        datastore: trackUsers.name,
        item: {
          user_id: inputs.user_id,
          tracking: getResp2.item.tracking,
          step: getResp2.item.step,
          coins: (preCoins2 - inputs.coins),
          messagets: getResp2.item.messagets,
        },
      });
      console.log(putResp2);

      return { outputs: {} };
    } else {
      if (inputs.user_id) {
        await client.chat.postMessage({
          channel: inputs.user_id,
          text: "You can't spend coins you don't have."
        });
      }
      return { outputs: {} };
    }
  },
);
