import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import usertime from "../datastores/timeusers.ts";
import minusCoins from "../datastores/coinusers.ts";

export const pingchecker = DefineFunction({
  callback_id: "pingcheck",
  title: "Ping and check users",
  description: "A function to respond to direct messages",
  source_file: "functions/pingme.ts",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

export default SlackFunction(
  pingchecker,
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
        const getStatus = await client.users.getPresence({
          user: getResp.item.user_id,
        });
        if (getStatus.presence == "active") {
          const putResp = await client.apps.datastore.put<
            typeof usertime.definition
          >({
            datastore: usertime.name,
            item: {
              number: num.toString(),
              user_id: getResp.item.user_id,
              timeOnline: (getResp.item.timeOnline + 1),
              timeOffline: getResp.item.timeOffline,
            },
          });
          console.log(putResp);

          const pingornot = await client.apps.datastore.get<
            typeof minusCoins.definition
          >({
            datastore: minusCoins.name,
            id: getResp.item.user_id,
          });

          const thisResp = await client.apps.datastore.get<
            typeof usertime.definition
          >({
            datastore: usertime.name,
            id: num.toString(),
          });

          if ((pingornot.item.coins && pingornot.item.coins > 0) && thisResp.item.timeOnline % 30 == 0) {
            const putping = await client.apps.datastore.put<
              typeof minusCoins.definition
            >({
              datastore: minusCoins.name,
              item: {
                user_id: getResp.item.user_id,
                coins: (pingornot.item.coins - 1),
              },
            });
            console.log(putping);
          } else {
            const newResp = await client.apps.datastore.get<
              typeof usertime.definition
            >({
              datastore: usertime.name,
              id: num.toString(),
            });
            if (newResp.item.timeOnline == 30) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Hey, <@${getResp.item.user_id}>, you've been on Slack for 30 minutes now...`,
              });
            } else if (newResp.item.timeOnline == 60) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Hey, <@${getResp.item.user_id}>, your Slack time has reached 1 hour.`,
              });
            } else if (newResp.item.timeOnline == 90) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Hey, <@${getResp.item.user_id}>, your Slack time is now 1 hour and 30 mins.`,
              });
            } else if (newResp.item.timeOnline == 120) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Hey, <@${getResp.item.user_id}>. You've been here for 2 hours now, maybe it's time to get off?`,
              });
            } else if (newResp.item.timeOnline == 150) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Hmm, <@${getResp.item.user_id}>. It's been 2 hours and 30 minutes, it's really time to get off now ya know.`,
              });
            } else if (newResp.item.timeOnline == 180) {
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `<@${getResp.item.user_id}> Haa...this is so disappointing. How could you want my help and still stay online for 3 HOURS? Just let me sleep twin...`,
              });
            } else if (newResp.item.timeOnline % 30 == 0) {
              const hours = Math.floor(newResp.item.timeOnline / 60);
              const mins = newResp.item.timeOnline % 60;
              await client.chat.postMessage ({
                channel: "C09GDF8ETQB",
                text: `Let's just get to the point, <@${getResp.item.user_id}>. You've been online for ${hours} hours and ${mins} minutes today.`,
              });
            }
          }
        } else if (getStatus.presence == "away") {
          const putResp = await client.apps.datastore.put<
            typeof usertime.definition
          >({
            datastore: usertime.name,
            item: {
              number: num.toString(),
              user_id: getResp.item.user_id,
              timeOnline: getResp.item.timeOnline,
              timeOffline: (getResp.item.timeOffline + 1),
            },
          });
          console.log(putResp);
        }
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
