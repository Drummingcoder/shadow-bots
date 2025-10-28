import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import game from "../datastores/tracker.ts";
import omnigames from "../datastores/omnigametrack.ts";
import multi from "../datastores/multigame.ts";

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
      },
      mode: {
        type: Schema.types.string,
        description: "What game mode?"
      },
      type: {
        type: Schema.types.string,
        description: "What kind of game?",
      }
    },
    required: ["channel", "user_id"],
  },
});

export default SlackFunction(
  starteOmni,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;

    if (!inputs.other_user) {
      const firstText = await client.chat.postMessage({
        channel: channelToPost,
        text: `<@${inputs.user_id}>, ready to play magical infinite RPS? Just reply in this thread with your move, and see how high your score can go!`,
      });

      if (inputs.type == "magic") {
        await client.chat.postMessage({
          channel: channelToPost,
          text: "What can beat a flying pig?",
          thread_ts: firstText.ts,
        });
        const putResp = await client.apps.datastore.put<
          typeof multi.definition
        >({
          datastore: multi.name,
          item: {
            game: firstText.ts,
            player1: inputs.user_id,
            messageinput: "",
            score: 0,
            finished: false,
            listofinputs: ["flying pig"],
            type: "magic",
          },
        });
        console.log(putResp);
      } else {
        await client.chat.postMessage({
          channel: channelToPost,
          text: "What can beat rock?",
          thread_ts: firstText.ts,
        });
        const putResp = await client.apps.datastore.put<
          typeof multi.definition
        >({
          datastore: multi.name,
          item: {
            game: firstText.ts,
            player1: inputs.user_id,
            messageinput: "",
            score: 0,
            finished: false,
            listofinputs: ["rock"],
            type: "general",
          },
        });
        console.log(putResp);
      }
      return { outputs: { } };
    } else if (inputs.mode == "multiple_answers") {
      const firstText = await client.chat.postMessage({
        channel: channelToPost,
        text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to play magical infinite RPS? Player 1, make your first move!`,
      });
      if (inputs.type == "magic") {
        const putResp = await client.apps.datastore.put<
          typeof multi.definition
        >({
          datastore: multi.name,
          item: {
            game: firstText.ts,
            player1: inputs.user_id,
            player2: inputs.other_user,
            messageinput: "",
            score: -1,
            finished: false,
            listofinputs: [],
            turn: 1,
            type: "magic",
          },
        });
        console.log(putResp);
      } else {
        const putResp = await client.apps.datastore.put<
          typeof multi.definition
        >({
          datastore: multi.name,
          item: {
            game: firstText.ts,
            player1: inputs.user_id,
            player2: inputs.other_user,
            messageinput: "",
            score: -1,
            finished: false,
            listofinputs: [],
            turn: 1,
            type: "general",
          },
        });
        console.log(putResp);
      }
      
      return { outputs: { } };
    }

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
      text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to a game of magical Omniscient Rock, Paper, Scissors!`,
    });

    if (inputs.type == "magic") {
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
          finished: false,
          type: "magic"
        },
      });
      console.log(putResp);
    } else {
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
          finished: false,
          type: "general"
        },
      });
      console.log(putResp);
    }
    
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
                text: "What's your move?"
            },
          },
          {
            type: "input",
            block_id: "input_move",
            label: {
              "type": "plain_text",
              "text": "Pick any move!",
              "emoji": true
            },
            element: {
              "type": "plain_text_input",
              "action_id": "rps_choice"
            }
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
                text: "What's your move?"
            },
          },
          {
            type: "input",
            block_id: "input_move",
            label: {
              "type": "plain_text",
              "text": "Pick any move!",
              "emoji": true
            },
            element: {
              "type": "plain_text_input",
              "action_id": "rps_choice"
            }
          }
        ],
        private_metadata: JSON.stringify({ 
          player: "p2", 
          userId: body.user.id,
          channelId: body.channel?.id,
          messageTs: body.message?.ts,
          gameId: body.actions[0].value,
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
      if (state[blockId].rps_choice && state[blockId].rps_choice.value) {
        selectedMove = state[blockId].rps_choice.value;
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

  if (pullValues.item.type == "magic") {
    /*const response1 = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user", 
            content: `Is the term ${selectedMove} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
          }
        ]
      })
    });

    const rep2 = await response1.json();
    const rep3 = rep2.choices[0].message.content;
    const rep4 = rep3.split("</think>")[1].replace("\n", "");
    console.log(rep4);*/

    const airesponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${"AIzaSyB8Kni3A8SOQPL2aCDd2uMIPRIiFHGcilE"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Is the term ${selectedMove} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.` }],
          },
        ],
      }),
    });
    const thedata = await airesponse.json();
    console.log(thedata);
    const rep4 = thedata.candidates[0].content.parts[0].text;


    if (rep4.toLowerCase().includes("no")) {
      return {
        response_action: "errors",
        errors: {
          input_move: "That's not a magic-related move! Please choose something related to magic (supernatural or mysterious forces)."
        }
      };
    }
  }

  let p2Input = "";
  let fin = false;
  if (pullValues.item.p2input) {
    p2Input = pullValues.item.p2input;
    fin = true;
  }

  const trythis = await client.apps.datastore.update<
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
        text: `It's a tie! Both players chose ${p1}.`,
      });
    }

    /*const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user", 
            content: `Who would win: ${p1} or ${p2}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${p1} would win against ${p2}, put "${p1} wins because [insert reason]". Otherwise, put "${p2} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.`
          }
        ]
      })
    });

    const aiResponse = await response.json();
    const reAI = aiResponse.choices[0].message.content;
    const winner = reAI.split("</think>")[1].replace("\n", "");
    console.log("Resp: ", aiResponse);
    console.log("\nCut:", reAI);
    console.log("\nwinner: ", winner);*/

    const airesponse1 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${"AIzaSyB8Kni3A8SOQPL2aCDd2uMIPRIiFHGcilE"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Who would win: ${p1} or ${p2}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${p1} would win against ${p2}, put "${p1} wins because [insert reason]". Otherwise, put "${p2} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.` }],
          },
        ],
      }),
    });

    const thedata1 = await airesponse1.json();
    console.log(thedata1);
    const winner = thedata1.candidates[0].content.parts[0].text;

    const wincondition = winner.replaceAll('\n', '').split("wins")[0];
    console.log("\nbro: ", wincondition);
    if (wincondition.toLowerCase().includes(p1.toLowerCase())) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player1}>'s answer of ${p1} won against <@${pullValues.item.player2}>'s answer of ${p2}! ${winner}`,
      });
    } else if (wincondition.toLowerCase().includes(p2.toLowerCase())) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player2}>'s answer of ${p2} won against <@${pullValues.item.player1}>'s answer of ${p1}! ${winner}`,
      });
    } else {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `Something went wrong.`,
      });
    }
  }
}).addViewSubmissionHandler("p2_inpu", async ({ body, client }) => {
  const metadata = JSON.parse(body.view.private_metadata || "{}");
  const state = body.view.state?.values;
  let selectedMove = "";
  if (state) {
    for (const blockId in state) {
      if (state[blockId].rps_choice && state[blockId].rps_choice.value) {
        selectedMove = state[blockId].rps_choice.value;
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

  if (pullValues.item.type == "magic") {
    /*const response1 = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user", 
            content: `Is the term ${selectedMove} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
          }
        ]
      })
    });

    const rep2 = await response1.json();
    const rep3 = rep2.choices[0].message.content;
    const rep4 = rep3.split("</think>")[1].replace("\n", "");
    console.log(rep4);*/

    const airesponse1 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${"AIzaSyB8Kni3A8SOQPL2aCDd2uMIPRIiFHGcilE"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Is the term ${selectedMove} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.` }],
          },
        ],
      }),
    });

    const thedata1 = await airesponse1.json();
    console.log(thedata1);
    const rep4 = thedata1.candidates[0].content.parts[0].text;

    if (rep4.toLowerCase().includes("no")) {
      return {
        response_action: "errors",
        errors: {
          input_move: "That's not a magic-related move! Please choose something related to magic (supernatural or mysterious forces)."
        }
      };
    }
  }

  let p1Input = "";
  let fin = false;
  if (pullValues.item.p1input) {
    p1Input = pullValues.item.p1input;
    fin = true;
  }

  const trythis = await client.apps.datastore.update<
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
        text: `It's a tie! Both players chose ${p1}.`,
      });
    }

    /*const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user", 
            content: `Who would win: ${p1} or ${p2}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${p1} would win against ${p2}, put "${p1} wins because [insert reason]". Otherwise, put "${p2} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.`
          }
        ]
      })
    });

    const aiResponse = await response.json();
    const reAI = aiResponse.choices[0].message.content;
    const winner = reAI.split("</think>")[1].replace("\n", "");
    console.log("Resp: ", aiResponse);
    console.log("\nCut:", reAI);
    console.log("\nwinner: ", winner);*/

    const airesponse2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${"AIzaSyB8Kni3A8SOQPL2aCDd2uMIPRIiFHGcilE"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Who would win: ${p1} or ${p2}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${p1} would win against ${p2}, put "${p1} wins because [insert reason]". Otherwise, put "${p2} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.` }],
          },
        ],
      }),
    });

    const thedata2 = await airesponse2.json();
    console.log(thedata2);
    const winner = thedata2.candidates[0].content.parts[0].text;

    const wincondition = winner.replaceAll('\n', '').split("wins")[0];
    console.log("\nbro: ", wincondition);
    if (wincondition.toLowerCase().includes(p1.toLowerCase())) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player1}>'s answer of "${p1}" won against <@${pullValues.item.player2}>'s answer of "${p2}"! ${winner}`,
      });
    } else if (wincondition.toLowerCase().includes(p2.toLowerCase())) {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `<@${pullValues.item.player2}>'s answer of "${p2}" won against <@${pullValues.item.player1}>'s answer of "${p1}"! ${winner}`,
      });
    } else {
      await client.chat.postMessage({
        channel: metadata.channelId,
        thread_ts: metadata.messageTs,
        text: `Something went wrong.`,
      });
      console.log ("p1:", p1);
      console.log ("p2:", p2);
    }
  }
});