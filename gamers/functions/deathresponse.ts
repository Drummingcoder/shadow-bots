import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import myDeath from "../datastores/deathtracker.ts";
import yourDeath from "../datastores/deathkeeper.ts";

export const getdeathrep = DefineFunction({
  callback_id: "get_death",
  title: "Process response",
  description: "Did your response help you survive?",
  source_file: "functions/deathresponse.ts",
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
      gamenum: {
        type: Schema.types.number,
        description: "what game"
      },
      respo: {
        type: Schema.types.string,
        description: "will it work"
      }
    },
    required: ["channel", "user_id", "gamenum"],
  },
});

export default SlackFunction(
  getdeathrep,
  async ({ inputs, client }) => {
    const num = inputs.gamenum;
    const user = inputs.user_id;
    const getResp1 = await client.apps.datastore.get<
      typeof myDeath.definition
    >({
      datastore: myDeath.name,
      id: num.toString(),
    });

    if (getResp1.item.finished) {
      await client.chat.postEphemeral({
        channel: inputs.channel,
        user: user,
        text: "Something went wrong",
      });
      return { outputs: { }};
    }

    if (! getResp1.item.player1) {
      await client.chat.postEphemeral({
        channel: inputs.channel,
        user: user,
        text: "Something went wrong",
      });
      return { outputs: { }};
    }

    if (getResp1.item.player1 == user) {
      /*const response1 = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user", 
              content: `This is a survival scenario: ${getResp1}\n\nWill this response survive the scenario provided: ${inputs.respo}\n\nAnswer with a simple yes or no and a one to three sentence justification. If the answer is yes, then respond: "yes because [insert reason]". If the answer is no, then respond, "no because [insert reason]."`
            }
          ]
        })
      });
      const rep2 = await response1.json();
      const rep3 = rep2.choices[0].message.content;
      const rep4 = rep3.split("</think>")[1].replace("\n", "");
      const rep5 = rep4.split("because")[0];*/

      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p1score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player1rep: inputs.respo,
          player1ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player2 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p2score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player2rep: inputs.respo,
          player2ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player3 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p3score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player3rep: inputs.respo,
          player3ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player4 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p4score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player4rep: inputs.respo,
          player4ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player5 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p5score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player5rep: inputs.respo,
          player5ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player6 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p6score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player6rep: inputs.respo,
          player6ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player7 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.candidates[0].content.parts[0].text;
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p7score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player7rep: inputs.respo,
          player7ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player8 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
              
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p8score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player8rep: inputs.respo,
          player8ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player9 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
          
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p9score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player9rep: inputs.respo,
          player9ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else if (getResp1.item.player10 == user) {
      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
              { role: "system", content: 'You are a survival expert. Analyze the provided scenario and the proposed response. Answer with a simple yes or no, followed by a 1 to 3 sentence justification. You MUST strictly adhere to one of the following two formats and no others: "yes because [insert 1-3 sentence reason]" or "no because [insert 1-3 sentence reason]". Do not add any extra text or commentary.' },
              { role: "user", content: `This is a survival scenario: ${getResp1.item.lastquestion}\n\nWill this response survive the scenario provided: ${inputs.respo}.`}
          ],
          max_tokens: 150, 
          temperature: 0.3,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();
      const rep4 = text.replaceAll("\n", "");
      const rep5 = rep4.split("because")[0];
      
      if (rep5.toLowerCase().includes("yes")) {
        await client.apps.datastore.update<
          typeof myDeath.definition
        >({
          datastore: myDeath.name,
          item: {
            number: num.toString(),
            p10score: 1,
          },
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        item: {
          number: num.toString(),
          player10rep: inputs.respo,
          player10ans: rep4,
        },
      });
      console.log(putResp);

      const putResp2 = await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          numofinputs: (getResp1.item.numofinputs + 1),
        },
      });
      console.log(putResp2);
    } else {
      await client.chat.postEphemeral({
        channel: inputs.channel,
        user: user,
        text: "You're not in this game!",
      });
      return { outputs: { }};
    }

    const getResp2 = await client.apps.datastore.get<
      typeof myDeath.definition
    >({
      datastore: myDeath.name,
      id: num.toString(),
    });

    if (getResp2.item.numofinputs >= getResp2.item.playersEntered) {
      await client.apps.datastore.update<
        typeof myDeath.definition
      >({
        datastore: myDeath.name,
        item: {
          number: num.toString(),
          finished: true,
        },
      });
      const getResp3 = await client.apps.datastore.get<
        typeof yourDeath.definition
      >({
        datastore: yourDeath.name,
        id: num.toString(),
      });

      const post = await client.chat.postMessage({
        channel: inputs.channel,
        text: `Here are the results of game #${num}!`,
      });

      await client.chat.postMessage({
        channel: inputs.channel,
        text: `<@${getResp2.item.player1}>, with your response of "${getResp3.item.player1rep}"...`,
        thread_ts: post.ts,
      });

      if (getResp2.item.p1score == 1) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `You have succeeded! The AI says, "${getResp3.item.player1ans}"`,
          thread_ts: post.ts,
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `You have failed! The AI says, "${getResp3.item.player1ans}"`,
          thread_ts: post.ts,
        });
      }

      if (getResp1.item.player2) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player2}>, with your response of "${getResp3.item.player2rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p2score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player2ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player2ans}"`,
            thread_ts: post.ts,
          });
        }
      }
      
      if (getResp1.item.player3) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player3}>, with your response of "${getResp3.item.player3rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p3score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player3ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player3ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player4) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player4}>, with your response of "${getResp3.item.player4rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p4score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player4ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player4ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player5) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player5}>, with your response of "${getResp3.item.player5rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p5score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player5ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player5ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player6) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player6}>, with your response of "${getResp3.item.player6rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p6score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player6ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player6ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player7) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player7}>, with your response of "${getResp3.item.player7rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p7score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player7ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player7ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player8) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player8}>, with your response of "${getResp3.item.player8rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p8score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player8ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player8ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player9) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player9}>, with your response of "${getResp3.item.player9rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p9score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player9ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player9ans}"`,
            thread_ts: post.ts,
          });
        }
      }

      if (getResp1.item.player10) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `<@${getResp2.item.player10}>, with your response of "${getResp3.item.player10rep}"...`,
          thread_ts: post.ts,
        });

        if (getResp2.item.p10score == 1) {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have succeeded! The AI says, "${getResp3.item.player10ans}"`,
            thread_ts: post.ts,
          });
        } else {
          await client.chat.postMessage({
            channel: inputs.channel,
            text: `You have failed! The AI says, "${getResp3.item.player10ans}"`,
            thread_ts: post.ts,
          });
        }
      }
      
      await client.chat.postMessage({
        channel: inputs.channel,
        text: `Thank you for playing! See ya next time!`,
        thread_ts: post.ts,
      });
    }

    return { outputs: { },};
  },
)