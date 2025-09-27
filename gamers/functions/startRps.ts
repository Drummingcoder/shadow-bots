import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import game from "../datastores/tracker.ts";
import games from "../datastores/gametrack.ts";

export const start = DefineFunction({
  callback_id: "start_ga",
  title: "Start Game",
  description: "Start a game of Omniscient Rock, Paper, Scissors",
  source_file: "functions/startRps.ts",
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
  start,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const firstText = await client.chat.postMessage({
      channel: channelToPost,
      text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to a game of Rock, Paper, Scissors!`,
    });
    let gamenum = 0;
    let getResp1 = await client.apps.datastore.get<
      typeof games.definition
    >({
      datastore: games.name,
      id: gamenum,
    });
    for (let i = 1; getResp1.item.finished && getResp1.item.finished == true; i++) {
      gamenum++;
      getResp1 = await client.apps.datastore.get<
        typeof games.definition
      >({
        datastore: games.name,
        id: gamenum,
      });
    }

    const putResp = await client.apps.datastore.put<
      typeof games.definition
    >({
      datastore: games.name,
      item: {
        number: gamenum,
        player1: inputs.user_id,
        p1input: "",
        player2: inputs.other_user,
        p2input: "",
        finished: false
      },
    });
    console.log(putResp);
    
    const _challenge = await client.chat.postMessage({
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
              "value": gamenum,
              "action_id": "p1_input",
              "style": "primary"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Player 2, go!"
              },
              "value": gamenum,
              "action_id": "p2_input",
              "style": "danger"
            }
          ]
        }
      ],
    });

    return {
      completed: false,
      outputs: undefined,
    };
  },
).addBlockActionsHandler("p1_input", async ({ body, client }) => {
	const { actions } = body;
	if (!actions) return;

  if (body.user.id !== actions[0].value) {
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
    id: "input",
  });
  if (getResp.item.value == 0 || !getResp.item.value) {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "input",
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
        name: "input",
        value: 0,
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
    callback_id: "p1_inpu",
    view: {
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
          player: "p1", 
          userId: body.user.id,
          channelId: body.channel?.id,
          messageTs: body.message?.ts,
          gameId: body.actions[0].value
        }),
    }
  });
  console.log(response);

	return { completed: false, outputs: undefined };
}).addBlockActionsHandler("p2_input", async ({ body, client }) => {
  const { actions } = body;
	if (!actions) return;

  if (body.user.id !== actions[0].value) {
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
    id: "input",
  });
  if (getResp.item.value == 0 || !getResp.item.value) {
    const putResp = await client.apps.datastore.put<
      typeof game.definition
    >({
      datastore: game.name,
      item: {
        name: "input",
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
        name: "input",
        value: 0,
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
      callback_id: "p2_inpu",
      view: {
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

	return { completed: false, outputs: undefined };
}).addViewSubmissionHandler("p1_inpu", async ({ body, client }) => {
  try {
    const metadata = JSON.parse(body.view.private_metadata || "{}");
    const userId = body.user.id;
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



    console.log(`${metadata.player} (${metadata.userId}) chose: ${selectedMove}`);
    
    return { completed: true, outputs: { interactivity: body.interactivity } };
  } catch (err) {
    console.error("Error in view submission handler:", err);
    return { completed: true, outputs: { interactivity: body.interactivity } };
  }
}).addViewSubmissionHandler("p2_inpu", async ({ body, client }) => {
  try {
    const metadata = JSON.parse(body.view.private_metadata || "{}");
    const userId = body.user.id;
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

    console.log(`${metadata.player} (${metadata.userId}) chose: ${selectedMove}`);

    // Send a confirmation message to the user
    client.chat.postMessage({
      channel: userId,
      text: selectedMove
        ? `You chose: ${selectedMove}`
        : "You did not select a move.",
    });
    
    return { completed: true, outputs: { interactivity: body.interactivity } };
  } catch (err) {
    console.error("Error in view submission handler:", err);
    return { completed: true, outputs: { interactivity: body.interactivity } };
  }
});