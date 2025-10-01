import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";

export const messenger = DefineFunction({
  callback_id: "responses",
  title: "Respond to a DM",
  description: "A function to respond to direct messages",
  source_file: "functions/messger.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
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
      }
    },
    required: ["message", "user", "channel", "messagets"],
  },
});

export default SlackFunction(
  messenger,
  async ({ inputs, client }) => {
    const userID = inputs.user;
    const message = inputs.message;
    const mests = inputs.messagets;

    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: userID,
    });

    if ((mests != getResp.item?.messagets) || !mests) {
      return { outputs: {} };
    }

    if (getResp.item?.tracking) {
      if (!getResp.item?.step) {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "You're already being tracked bud, lemme go to sleep."
        });
      }
    } else if ((!getResp.item?.step) || getResp.item?.step == 0) {
      return { outputs: {} };
    } else if (getResp.item?.step == 1) {
      if ((message == "yes" || message == "y") || (message == "Yes" || message == "Y")) {
        const yo = await client.users.getPresence({
          user: userID,
        });
        if (yo.manual_away == false) {
          await client.chat.postMessage({
            channel: inputs.channel,
            thread_ts: inputs.messagets,
            text: "There are rules to my tracking, you can't manual set your presence to away like that. What, scared of a green light on your profile? I need that to track you ya know? So uh, kindly turn it on for me?"
          });
        }
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 2,
            coins: 0,
            messagets: mests,
          },
        });
        console.log(putResp);
      } else if ((message == "no" || message == "n") || (message == "No" || message == "N")) {
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 0,
            coins: 0,
            messagets: mests,
          },
        });
        console.log(putResp);
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "Don't worry about it, this isn't for everyone. :wink:"
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "There's not a valid answer. Haa...do you really want to have a bad time?"
        });
        return { outputs: {} };
      } 
    }

    return { outputs: {} };
  },
);
