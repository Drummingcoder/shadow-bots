import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import myDeath from "../datastores/deathtracker.ts";

export const dome = DefineFunction({
  callback_id: "storepeople",
  title: "Adding to Database",
  description: "More people partcipate yay!",
  source_file: "functions/addpeople.ts",
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
      messagets: {
        type: Schema.types.string,
        description: "correct thread?",
      },
      threadts: {
        type: Schema.types.string,
        description: "reply here",
      }
    },
    required: ["channel", "user_id", "messagets", "threadts"],
  },
});

export default SlackFunction(
  dome,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const timestamp = inputs.threadts;
    const mess = inputs.messagets;
    const user = inputs.user_id;

    const getResp1 = await client.apps.datastore.get<
      typeof myDeath.definition
    >({
      datastore: myDeath.name,
      id: timestamp,
    });

    if (! getResp1.item.player1) {
      return { outputs: { } };
    }

    if (getResp1.item.player1 == user || getResp1.item.player2 == user || getResp1.item.player3 == user || getResp1.item.player4 == user || getResp1.item.player5 == user || getResp1.item.player6 == user || getResp1.item.player7 == user || getResp1.item.player8 == user || getResp1.item.player9 == user || getResp1.item.player10 == user) {
      await client.chat.postEphemeral({
        channel: channelToPost,
        user: user,
        text: "You can't join twice!",
        thread_ts: timestamp,
      });
      return { outputs: { } };
    }
    
    if (getResp1.item.player10 || getResp1.item.player10 == user) {
      await client.chat.postEphemeral({
        channel: channelToPost,
        user: user,
        text: "Sorry, the lobby is full.",
        thread_ts: timestamp,
      });
      return { outputs: { } };
    }

    if (! getResp1.item.player2) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player2: user,
          p2score: 0,
          playersEntered: 2,
        },
      });
    } else if (! getResp1.item.player3) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player3: user,
          p3score: 0,
          playersEntered: 3,
        },
      });
    } else if (! getResp1.item.player4) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player4: user,
          p4score: 0,
          playersEntered: 4,
        },
      });
    } else if (! getResp1.item.player5) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player5: user,
          p5score: 0,
          playersEntered: 5,
        },
      });
    } else if (! getResp1.item.player6) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player6: user,
          p6score: 0,
          playersEntered: 6,
        },
      });
    } else if (! getResp1.item.player7) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player7: user,
          p7score: 0,
          playersEntered: 7,
        },
      });
    } else if (! getResp1.item.player8) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player8: user,
          p8score: 0,
          playersEntered: 8,
        },
      });
    } else if (! getResp1.item.player9) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player9: user,
          p9score: 0,
          playersEntered: 9,
        },
      });
    } else {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          ts: timestamp,
          player10: user,
          p10score: 0,
          playersEntered: 10,
        },
      });
      await client.chat.postMessage({
        channel: channelToPost,
        text: "The lobby is now full! Please wait for the host to start the game.",
        thread_ts: timestamp,
      });
    }

    await client.reactions.add({
      channel: channelToPost,
      timestamp: mess,
      name: "white_check_mark",
    });

    return { outputs: { } };
  },
);