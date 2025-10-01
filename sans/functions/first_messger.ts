import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";

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

    return { outputs: {} };
  },
);
