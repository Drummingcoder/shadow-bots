import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import usertime from "../datastores/timeusers.ts";

export const counter = DefineFunction({
  callback_id: "coins",
  title: "Get rich",
  description: "A function to reset the database",
  source_file: "functions/coin.ts",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

export default SlackFunction(
  counter,
  async ({ inputs, client }) => {
    let num = 0;
    let getResp = await client.apps.datastore.get<
      typeof usertime.definition
    >({
      datastore: usertime.name,
      id: num.toString(),
    });

    while (getResp.item.user_id && getResp.item.user_id != null) {
      const getResp2 = await client.apps.datastore.get<
        typeof trackUsers.definition
      >({
        datastore: trackUsers.name,
        id: getResp.item.user_id,
      });
      if (getResp2.item.tracking == true) {
        const hours = Math.floor(getResp.item.timeOffline / 60);
        let coins = 0;
        if ((hours - 7) < 0) {
          coins = 0;
        } else {
          coins = hours - 7;
        }
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: getResp2.item.user_id,
            tracking: true,
            step: getResp2.item.step,
            coins: (getResp2.item.coins + coins),
            messagets: getResp2.item.messagets,
          },
        });
        console.log(putResp);
        const putResp2 = await client.apps.datastore.put<
          typeof usertime.definition
        >({
          datastore: usertime.name,
          item: {
            number: getResp.item.number,
            user_id: getResp2.item.user_id,
            timeOnline: 0,
            timeOffline: 0,
          },
        });
        console.log(putResp2);
      }

      num++;
      getResp = await client.apps.datastore.get<
        typeof usertime.definition
      >({
        datastore: usertime.name,
        id: num.toString(),
      });
    }
    return { outputs: {} };
  },
);
