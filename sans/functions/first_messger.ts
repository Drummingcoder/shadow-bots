import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import usertime from "../datastores/timeusers.ts";

export const messenger = DefineFunction({
  callback_id: "responsesfirst",
  title: "Respond to a Mention",
  description: "A function to respond to bot mention",
  source_file: "functions/first_messger.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "channel to post the message in",
      },
      messagets: {
        type: Schema.types.string,
        description: "The timestamp of the message",
      },
      message: {
        type: Schema.types.string,
        description: "Message content",
      }
    },
    required: ["user", "channel", "messagets"],
  },
});

export default SlackFunction(
  messenger,
  async ({ inputs, client }) => {
    const userID = inputs.user;

    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: userID,
    });
    const myMessage = inputs.message;

    if (myMessage?.includes("coin") && getResp.item?.tracking) {
      await client.chat.postMessage({
        channel: inputs.channel,
        thread_ts: inputs.messagets,
        text: `You have ${getResp.item.coins} coins so far.`
      });
    } else if (myMessage?.includes("time today") && getResp.item?.tracking) {
      let i = 0;
      let getResp2 = await client.apps.datastore.get<
        typeof usertime.definition
      >({
        datastore: usertime.name,
        id: i.toString(),
      });
      for (i = 1; getResp2.item.user_id != userID; i++) {
        getResp2 = await client.apps.datastore.get<
          typeof usertime.definition
        >({
          datastore: usertime.name,
          id: i.toString(),
        });
      }
      await client.chat.postMessage({
        channel: inputs.channel,
        thread_ts: inputs.messagets,
        text: `You have been online for ${getResp2.item.timeOnline} minutes and offline for ${getResp2.item.timeOffline} minutes today.`
      });
    } else if ((myMessage?.toLowerCase().includes("stop") || myMessage?.toLowerCase().includes("fuck")) && getResp.item?.tracking) {
      await client.chat.postMessage({
        channel: inputs.channel,
        thread_ts: inputs.messagets,
        text: `Things are getting a bit too tough for you huh? Only the strong can persevere like true warriors. Heh, there's no way out buddy. You've gone too far to stop now. You should have known the moment you stepped in.\n\nIf you really want out, DM the creator of the bot. I'm not gonna stop trying to track your time just on a whim, twin.`
      });
    } else {
      if (getResp.item?.tracking) {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "You're already being tracked bud, lemme go to sleep."
        });
      } else {
        if (!getResp.item?.step) {
          const putResp = await client.apps.datastore.put<
            typeof trackUsers.definition
          >({
            datastore: trackUsers.name,
            item: {
              user_id: userID,
              tracking: false,
              step: 1,
              coins: 0,
              messagets: inputs.messagets,
            },
          });
          console.log(putResp);
          await client.chat.postMessage({
            channel: inputs.channel,
            thread_ts: inputs.messagets,
            text: "Oh, so you need help monitoring your slack time huh...It ain't gonna be easy, kiddo. You still want to continue? Answer with a simple yes/no."
          });
        }
      }
    }
    return { outputs: {} };
  },
);
