import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import multi from "../datastores/multigame.ts";

export const doit = DefineFunction({
  callback_id: "continuegame",
  title: "Continue game",
  description: "Continue an Omni game",
  source_file: "functions/runner.ts",
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
      message: {
        type: Schema.types.string,
        description: "the move",
      },
      threadts: {
        type: Schema.types.string,
        description: "reply here",
      }
    },
    required: ["channel", "user_id", "message", "threadts"],
  },
});

export default SlackFunction(
  doit,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const timestamp = inputs.threadts;
    const mess = inputs.message;
    const user = inputs.user_id;

    const getResp1 = await client.apps.datastore.get<
      typeof multi.definition
    >({
      datastore: multi.name,
      id: timestamp,
    });

    if (!getResp1.item.player1 || getResp1.item.finished == true) {
      return { outputs: { } };
    }

    if (!getResp1.item.player2) {
      if (getResp1.item.player1 != user) {
        return { outputs: { } };
      }
      if (getResp1.item.messageinput == "") {
        let starter = "rock";
        if (getResp1.item.type == "magic") {
          starter = "flying pig";
          const magicresponse = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user", 
                  content: `Is the term ${mess} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
                }
              ]
            })
          });

          const rep2 = await magicresponse.json();
          const rep3 = rep2.choices[0].message.content;
          const rep4 = rep3.split("</think>")[1].replace("\n", "");
          console.log(rep4);
          if (rep4.toLowerCase().includes("no")) {
            await client.chat.postEphemeral({
              channel: channelToPost,
              user: user,
              thread_ts: timestamp,
              text: `That's not a magic-related move, please try again or change your answer.`,
            });
            return {outputs: { }};
          }
        }
        const response = await fetch("https://ai.hackclub.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user", 
                content: `Which would win: ${starter} or ${mess}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if rock would win against ${mess}, put "rock wins because [insert reason]". Otherwise, put "${mess} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.`
              }
            ]
          })
        });

        const aiResponse = await response.json();
        const reAI = aiResponse.choices[0].message.content;
        const winner = reAI.split("</think>")[1].replace("\n", "");
        const wincondition = winner.split("wins")[0];
        if (wincondition.toLowerCase().includes(mess.toLowerCase())) {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `${winner}\n\nSo, what would win against "${mess}"?`,
          });
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              messageinput: mess,
              score: (getResp1.item.score + 1),
              finished: false,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
            },
          });
          console.log([...(getResp1.item.listofinputs || []), mess]);
          console.log(putResp);
        } else {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `Unfortunately ${winner}\n\nYou achieved a score of ${getResp1.item.score}!`,
          });
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              messageinput: mess,
              score: (getResp1.item.score),
              finished: true,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
            },
          });
          console.log(putResp);
        }
      } else {
        const pre = getResp1.item.messageinput;

        for (let i = 0; i < getResp1.item.listofinputs.length; i++) {
          if (mess.toLowerCase() == getResp1.item.listofinputs[i].toLowerCase()) {
            await client.chat.postMessage({
              channel: channelToPost,
              thread_ts: timestamp,
              text: `You can't reuse answers! Try again!`,
            });
            return { outputs: { } };
          }
        }

        if (getResp1.item.type == "magic") {
          const magicresponse = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user", 
                  content: `Is the term ${mess} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
                }
              ]
            })
          });

          const rep2 = await magicresponse.json();
          const rep3 = rep2.choices[0].message.content;
          const rep4 = rep3.split("</think>")[1].replace("\n", "");
          console.log(rep4);
          if (rep4.toLowerCase().includes("no")) {
            await client.chat.postEphemeral({
              channel: channelToPost,
              user: user,
              thread_ts: timestamp,
              text: `That's not a magic-related move, please try again or change your answer.`,
            });
            return { outputs: { } };
          }
        }

        const response = await fetch("https://ai.hackclub.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user", 
                content: `Which would win: ${pre} or ${mess}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${pre} would win against ${mess}, put "rock wins because [insert reason]". Otherwise, put "${mess} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.`
              }
            ]
          })
        });

        const aiResponse = await response.json();
        const reAI = aiResponse.choices[0].message.content;
        const winner = reAI.split("</think>")[1].replace("\n", "");
        const wincondition = winner.split("wins")[0];
        if (wincondition.toLowerCase().includes(mess.toLowerCase())) {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `${winner}\n\nSo, what would win against "${mess}"?`,
          });
          const arr = (getResp1.item.listofinputs || []).concat(mess);
          console.log("array: ", arr);
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              messageinput: mess,
              score: (getResp1.item.score + 1),
              finished: false,
              listofinputs: arr,
            },
          });
          console.log(putResp);
        } else if (wincondition.toLowerCase().includes(pre.toLowerCase())) {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `Unfortunately ${winner}\n\nYou achieved a score of ${getResp1.item.score}!`,
          });
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              messageinput: mess,
              score: getResp1.item.score,
              finished: true,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
            },
          });
          console.log([...(getResp1.item.listofinputs || []), mess]);
          console.log(putResp);
        } else {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `Something went wrong: ${winner}, please try again.`,
          });
        }
      }
    } else {
      if (getResp1.item.player1 != user && getResp1.item.turn != 1) {
        if (getResp1.item.player2 != user && getResp1.item.turn != 2) {
          return { outputs: {} };
        }
      }
      if (getResp1.item.messageinput == "") {
        if (getResp1.item.type == "magic") {
          const magicresponse = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user", 
                  content: `Is the term ${mess} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
                }
              ]
            })
          });

          const rep2 = await magicresponse.json();
          const rep3 = rep2.choices[0].message.content;
          const rep4 = rep3.split("</think>")[1].replace("\n", "");
          console.log(rep4);
          if (rep4.toLowerCase().includes("no")) {
            await client.chat.postEphemeral({
              channel: channelToPost,
              user: user,
              thread_ts: timestamp,
              text: `That's not a magic-related move, please try again or change your answer.`,
            });
            return {outputs: { }};
          }
        }
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `So, player 2, what would win against "${mess}"?`,
          });
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              player2: getResp1.item.player2,
              messageinput: mess,
              score: -1,
              finished: false,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
              turn: 2,
            },
          });
          console.log(putResp);
      } else {
        const pre = getResp1.item.messageinput;

        for (let i = 0; i < getResp1.item.listofinputs.length; i++) {
          if (mess == getResp1.item.listofinputs[i]) {
            await client.chat.postMessage({
              channel: channelToPost,
              thread_ts: timestamp,
              text: `You can't reuse answers! Try again!`,
            });
            return { outputs: { } };
          }
        }

        if (getResp1.item.type == "magic") {
          const magicresponse = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user", 
                  content: `Is the term ${mess} related to magic in any way? This is the definition of magic by the way, "the power of apparently influencing the course of events by using mysterious or supernatural forces." Please respond with a simple yes or no.`
                }
              ]
            })
          });

          const rep2 = await magicresponse.json();
          const rep3 = rep2.choices[0].message.content;
          const rep4 = rep3.split("</think>")[1].replace("\n", "");
          console.log(rep4);
          if (rep4.toLowerCase().includes("no")) {
            await client.chat.postEphemeral({
              channel: channelToPost,
              user: user,
              thread_ts: timestamp,
              text: `That's not a magic-related move, please try again or change your answer.`,
            });
            return {outputs: { }};
          }
        }

        const response = await fetch("https://ai.hackclub.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user", 
                content: `Which would win: ${pre} or ${mess}? Just give me the winner and a short explanation (1 sentence) in the form "[Insert winner] wins because [insert reason]". So if ${pre} would win against ${mess}, put "rock wins because [insert reason]". Otherwise, put "${mess} wins because [insert reason]." No ties! Don't add any extra punctuation or brackets/parathesis to the response.`
              }
            ]
          })
        });

        const aiResponse = await response.json();
        const reAI = aiResponse.choices[0].message.content;
        const winner = reAI.split("</think>")[1].replace("\n", "");
        const wincondition = winner.split("wins")[0];
        if (wincondition.toLowerCase().includes(mess.toLowerCase())) {
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `${winner}\n\nSo, what would win against "${mess}"?`,
          });

          let theturn = 1;
          if (getResp1.item.turn == 1) {
            theturn = 2;
          }

          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              player2: getResp1.item.player2,
              messageinput: mess,
              score: -1,
              finished: false,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
              turn: theturn,
            },
          });
          console.log(putResp);
        } else if (wincondition.toLowerCase().includes(pre.toLowerCase())) {
          let the = "", lose = "";
          if (getResp1.item.turn == 1) {
            the = getResp1.item.player2;
            lose = getResp1.item.player1;
          } else {
            the = getResp1.item.player1;
            lose = getResp1.item.player2;
          }
          await client.chat.postMessage({
            channel: channelToPost,
            thread_ts: timestamp,
            text: `Unfortunately ${winner}\n\n<@${the}> wins against <@${lose}>!`,
          });
          const putResp = await client.apps.datastore.update<
            typeof multi.definition
          >({
            datastore: multi.name,
            item: {
              game: timestamp,
              player1: getResp1.item.player1,
              player2: getResp1.item.player2,
              messageinput: mess,
              score: -1,
              finished: true,
              listofinputs: (getResp1.item.listofinputs || []).concat(mess),
            },
          });
          console.log(putResp);
        }
      }
    }
    
    return { outputs: { } };
  },
);