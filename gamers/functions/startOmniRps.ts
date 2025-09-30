import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import game from "../datastores/tracker.ts";
import omnigames from "../datastores/omnigametrack.ts";

export const starteOmni = DefineFunction({
  callback_id: "start_om",
  title: "Start Omni Game",
  description: "Start a game of Omniscient Rock, Paper, Scissors",
  source_file: "functions/startOmniRps.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to post in",
      },
      other_user: {
        type: Schema.slack.types.user_id,
        description: "opponent user",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
	  interactivity: {
		type: Schema.slack.types.interactivity,
		description: "Interactivity",
	  }
    },
    required: ["channel", "other_user", "user_id"],
  },
});

export default SlackFunction(
  starteOmni,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    let gamenum = 0;
    let getResp1 = await client.apps.datastore.get<
      typeof omnigames.definition
    >({
      datastore: omnigames.name,
      id: gamenum.toString(),
    });
    for (let i = 1; getResp1.item.finished && getResp1.item.finished == true; i++) {
      gamenum++;
      getResp1 = await client.apps.datastore.get<
        typeof omnigames.definition
      >({
        datastore: omnigames.name,
        id: gamenum.toString(),
      });
    }
    const getGame = await client.apps.datastore.get<
      typeof game.definition
    >({
      datastore: game.name,
      id: "omniinput",
    });

    if (getGame.item.value != 2) {
      const putResp = await client.apps.datastore.put< //to remove after running program for the first time
        typeof game.definition
      >({
        datastore: game.name,
        item: {
          name: "omniinput",
          value: 2,
        },
      });
      await client.chat.postEphemeral({
        channel: channelToPost,
        user: inputs.user_id,
        text: `A game is still ongoing!`,
      });
      return { outputs: {}};
    } else {
      const putResp = await client.apps.datastore.put<
        typeof game.definition
      >({
        datastore: game.name,
        item: {
          name: "omniinput",
          value: 0,
        },
      });
      console.log(putResp);
    }
    const firstText = await client.chat.postMessage({
      channel: channelToPost,
      text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to a game of Omniscient Rock, Paper, Scissors!`,
    });

    const putResp = await client.apps.datastore.put<
      typeof omnigames.definition
    >({
      datastore: omnigames.name,
      item: {
        number: gamenum.toString(),
        player1: inputs.user_id,
        p1input: "",
        player2: inputs.other_user,
        p2input: "",
        finished: false
      },
    });
    console.log(putResp);
    
    const challenge = await client.chat.postMessage({
      channel: channelToPost,
      thread_ts: firstText.ts,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Put your inputs in!",
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Player 1, go!"
              },
              "value": gamenum.toString(),
              "action_id": "p1_input",
              "style": "primary"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Player 2, go!"
              },
              "value": gamenum.toString(),
              "action_id": "p2_input",
              "style": "danger"
            }
          ]
        }
      ],
    });
    console.log(challenge);

    return {
      completed: false,
      outputs: undefined,
    };
  },
).addBlockActionsHandler("p1_input", async ({ body, client }) => {
	const { actions } = body;
	if (!actions) return;

  const getResp2 = await client.apps.datastore.get<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    id: actions[0].value.toString(),
  });

  if (body.user.id !== getResp2.item.player1) {
    await client.chat.postEphemeral({
      channel: body.channel?.id!,
      user: body.user.id,
      text: "This button isn't for you!",
    });
    return { completed: false, outputs: {} };
  }

  const getResp = await client.apps.datastore.get<
    typeof game.definition
  >({
    datastore: game.name,
    id: "omniinput",
  });
  if (getResp.item.value == 0 || !getResp.item.value) {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "omniinput",
        value: 1,
      },
    });
    console.log(putResp);
    if ((body.message && body.channel)) {
      const blocks = body.message.blocks.map(block => {
        if (block.type === "actions") {
          return {
            ...block,
            elements: block.elements.filter(
              (el: any) => el.action_id !== "p1_input"
            ),
          };
        }
        return block;
      });
      await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          ...blocks,
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P1 is entering their input!`
              }
            ]
          },
        ]
      });
    }
  } else {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "omniinput",
        value: 2,
      },
    });
    console.log(putResp);
    if ((body.message && body.channel)) {
      const _rep = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          ...body.message.blocks.slice(0, -2),
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P1 is entering their input!`
              }
            ]
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P2 is entering their input!`
              }
            ]
          },
        ]
      });
    }
  }
  
  const response = await client.views.open({
    interactivity_pointer: body.interactivity?.interactivity_pointer,
    view: {
        callback_id: "p1_inpu",
        type: "modal",
        title: {
            type: "plain_text",
            text: "Your Move"
        },
        submit: {
            type: "plain_text",
            text: "Submit"
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Choose your move:"
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "plain_text_input",
                        action_id: "rps_choice",
                        placeholder: {
                          type: "plain_text",
                          text: "Put anything!"
                        }
                    }
                ]
            }
        ],
        private_metadata: JSON.stringify({ 
          player: "p1", 
          userId: body.user.id,
          channelId: body.channel?.id,
          messageTs: body.message?.ts,
          gameId: body.actions[0].value
        }),
    }
  });
  console.log(response);

	return { completed: true, outputs: { interactivity: body.interactivity } };
}).addBlockActionsHandler("p2_input", async ({ body, client }) => {
  const { actions } = body;
	if (!actions) return;

  const getResp3 = await client.apps.datastore.get<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    id: actions[0].value.toString(),
  });

  if (body.user.id !== getResp3.item.player2) {
    await client.chat.postEphemeral({
      channel: body.channel?.id!,
      user: body.user.id,
      text: "This button isn't for you!",
    });
    return { completed: false, outputs: {} };
  }

  const getResp = await client.apps.datastore.get<
    typeof game.definition
  >({
    datastore: game.name,
    id: "omniinput",
  });
  if (getResp.item.value == 0 || !getResp.item.value) {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "omniinput",
        value: 1,
      },
    });
    console.log(putResp);
    if ((body.message && body.channel)) {
      const blocks = body.message.blocks.map(block => {
        if (block.type === "actions") {
          return {
            ...block,
            elements: block.elements.filter(
              (el: any) => el.action_id !== "p2_input"
            ),
          };
        }
        return block;
      });
      await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          ...blocks,
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P2 is entering their input!`
              }
            ]
          },
        ]
      });
    }
  } else {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "omniinput",
        value: 2,
      },
    });
    console.log(putResp);
    if ((body.message && body.channel)) {
      const _rep = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
          ...body.message.blocks.slice(0, -2),
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P1 is entering their input!`
              }
            ]
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `P2 is entering their input!`
              }
            ]
          },
        ]
      });
    }
  }
  
  const response = await client.views.open({
      interactivity_pointer: body.interactivity?.interactivity_pointer,
      view: {
        callback_id: "p2_inpu",
        type: "modal",
        title: {
            type: "plain_text",
            text: "Your Move"
        },
        submit: {
            type: "plain_text",
            text: "Submit"
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Choose your move:"
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "radio_buttons",
                        action_id: "rps_choice",
                        options: [
                            {
                                text: { type: "plain_text", text: "Rock" },
                                value: "rock"
                            },
                            {
                                text: { type: "plain_text", text: "Paper" },
                                value: "paper"
                            },
                            {
                                text: { type: "plain_text", text: "Scissors" },
                                value: "scissors"
                            }
                        ]
                    }
                ]
            }
        ],
        private_metadata: JSON.stringify({ 
          player: "p2", 
          userId: body.user.id,
          channelId: body.channel?.id,
          messageTs: body.message?.ts,
          gameId: body.actions[0].value
        }),
      }
  });
  console.log(response);

	return { completed: true, outputs: { interactivity: body.interactivity } };
}).addViewSubmissionHandler("p1_inpu", async ({ body, client }) => {
  const metadata = JSON.parse(body.view.private_metadata || "{}");
  const state = body.view.state?.values;
  let selectedMove = "";
  if (state) {
    for (const blockId in state) {
      if (state[blockId].rps_choice && state[blockId].rps_choice.selected_option) {
        selectedMove = state[blockId].rps_choice.selected_option.value;
        break;
      }
    }
  }

  const pullValues = await client.apps.datastore.get<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    id: metadata.gameId.toString(),
  });

  let p2Input = "";
  let fin = false;
  if (pullValues.item.p2input) {
    p2Input = pullValues.item.p2input;
    fin = true;
  }

  const trythis = await client.apps.datastore.put<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    item: {
      number: metadata.gameId.toString(),
      player1: pullValues.item.player1,
      p1input: selectedMove,
      player2: pullValues.item.player2,
      p2input: p2Input,
      finished: fin
    },
  });
  console.log(trythis);
  console.log(`${metadata.player} (${metadata.userId}) chose: ${selectedMove}`);

  if (fin) {
    const p1 = selectedMove;
    const p2 = p2Input;
    
    if (p1 === p2) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `It's a tie! Both players chose *${p1}*.`,
      });
    } else if ((p1 == "rock" && p2 == "scissors") ||
               (p1 == "scissors" && p2 == "paper") ||
               (p1 == "paper" && p2 == "rock")) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player1}> wins! They threw ${p1} while <@${pullValues.item.player2}> threw ${p2}.`,
      });
    } else if ((p2 == "rock" && p1 == "scissors") ||
               (p2 == "scissors" && p1 == "paper") ||
               (p2 == "paper" && p1 == "rock")) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player2}> wins! They threw ${p2} while <@${pullValues.item.player1}> threw ${p1}.`,
      });
    }
  }
}).addViewSubmissionHandler("p2_inpu", async ({ body, client }) => {
  const metadata = JSON.parse(body.view.private_metadata || "{}");
  const state = body.view.state?.values;
  let selectedMove = "";
  if (state) {
    for (const blockId in state) {
      if (state[blockId].rps_choice && state[blockId].rps_choice.selected_option) {
        selectedMove = state[blockId].rps_choice.selected_option.value;
        break;
      }
    }
  }

  const pullValues = await client.apps.datastore.get<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    id: metadata.gameId.toString(),
  });

  let p1Input = "";
  let fin = false;
  if (pullValues.item.p1input) {
    p1Input = pullValues.item.p1input;
    fin = true;
  }

  const trythis = await client.apps.datastore.put<
    typeof omnigames.definition
  >({
    datastore: omnigames.name,
    item: {
      number: metadata.gameId.toString(),
      player1: pullValues.item.player1,
      p1input: p1Input,
      player2: pullValues.item.player2,
      p2input: selectedMove,
      finished: fin
    },
  });
  console.log(trythis);
  console.log(`${metadata.player} (${metadata.userId}) chose: ${selectedMove}`);

  if (fin) {
    const p1 = p1Input;
    const p2 = selectedMove;
    
    if (p1 === p2) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `It's a tie! Both players chose *${p1}*.`,
      });
    } else if ((p1 == "rock" && p2 == "scissors") ||
               (p1 == "scissors" && p2 == "paper") ||
               (p1 == "paper" && p2 == "rock")) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player1}> wins! They threw ${p1} while <@${pullValues.item.player2}> threw ${p2}.`,
      });
    } else if ((p2 == "rock" && p1 == "scissors") ||
               (p2 == "scissors" && p1 == "paper") ||
               (p2 == "paper" && p1 == "rock")) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player2}> wins! They threw ${p2} while <@${pullValues.item.player1}> threw ${p1}.`,
      });
    }
  }
});