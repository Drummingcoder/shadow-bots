import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import myDeath from "../datastores/deathtracker.ts";

export const startDeathGame = DefineFunction({
  callback_id: "start_dea",
  title: "Start Death Game",
  description: "Start a game of Death by AI",
  source_file: "functions/deathly.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to post in",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
        description: "Interactivity",
      },
    },
    required: ["channel", "user_id"],
  },
});

export default SlackFunction(
  startDeathGame,
  async ({ inputs, client }) => {
    const host = inputs.user_id;
    const mess = await client.chat.postMessage({
      channel: inputs.channel,
      text: `<@${host}> wants to play a game of Death by AI! Anyone who wants to play with them, reply to this message.`
    });

    const putResp = await client.apps.datastore.put<
      typeof myDeath.definition
    >({
      datastore: myDeath.name,
      item: {
        ts: mess.ts,
        player1: host,
        p1score: 0,
        playersEntered: 1,
        numofinputs: 0,
        round: 0,
        finished: false,
      },
    });

    console.log(putResp);

    return { outputs: { },};
  },
)