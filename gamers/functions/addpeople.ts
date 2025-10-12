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
      },
      message: {
        type: Schema.types.string,
        description: "let's start",
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
    const themess = inputs.message;

    let i = 0;
    let getResp1 = await client.apps.datastore.get<
      typeof myDeath.definition
    >({
      datastore: myDeath.name,
      id: i.toString(),
    });

    if (getResp1.item.ts && getResp1.item.ts != timestamp) {
      while (getResp1.item.ts && getResp1.item.ts != timestamp) {
        i++;
        getResp1 = await client.apps.datastore.get<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          id: i.toString(),
        });
        console.log("item ", i, "  ", getResp1);
      }
    }

    if (getResp1.item.ts != timestamp) {
      return { outputs: { } };
    }

    if (! getResp1.item.player1) {
      return { outputs: { } };
    }

    console.log(mess);
    if (getResp1.item.player1 == user && themess && themess.toLowerCase() == "start") {
      await client.chat.postMessage({
        channel: channelToPost,
        text: "Alright, starting the game...",
        thread_ts: timestamp,
      });
      const update = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: i.toString(),
          round: 1,
        },
      });
      console.log(update);

      const response1 = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user", 
              content: `Give a scenario of any kind, it can be silly, it can be serious, it can be realistic, or it can be unrealistic. Just provide a scenario to survive, it can be of ANY kind. Make it around 150 characters or less. It has to end with the question, "How will you survive?"`
            }
          ]
        })
      });

      const rep2 = await response1.json();
      const rep3 = rep2.choices[0].message.content;
      const rep4 = rep3.split("</think>")[1].replace("\n", "");
      await client.chat.postMessage({
        channel: channelToPost,
        text: `Alright, your first scenario out of 10. Respond with the "/deathrespond" command.\n\n${rep4}`,
        thread_ts: timestamp,
      });

      return { outputs: {} };
    }

    /*if (getResp1.item.player1 == user || getResp1.item.player2 == user || getResp1.item.player3 == user || getResp1.item.player4 == user || getResp1.item.player5 == user || getResp1.item.player6 == user || getResp1.item.player7 == user || getResp1.item.player8 == user || getResp1.item.player9 == user || getResp1.item.player10 == user) {
      await client.chat.postEphemeral({
        channel: channelToPost,
        user: user,
        text: "You can't join twice!",
        thread_ts: timestamp,
      });
      return { outputs: { } };
    }*/
    
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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
          number: i.toString(),
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