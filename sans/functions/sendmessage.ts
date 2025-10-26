import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import nodupreminds from "../datastores/havereminder.ts";
import usertime from "../datastores/timeusers.ts";

export const othersend = DefineFunction({
  callback_id: "letssendto",
  title: "Execution",
  description: "Time to send the daily reminder",
  source_file: "functions/sendmessage.ts",
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
      apikey: {
        type: Schema.types.string,
      },
    },
    required: ["user", "channel"],
  },
});

export default SlackFunction(
  othersend,
  async ({ inputs, client }) => {
    let num = 0;
    let getResp = await client.apps.datastore.get<
      typeof usertime.definition
    >({
      datastore: usertime.name,
      id: num.toString(),
    });
    
    while (getResp.item.user_id != inputs.user && getResp.item.user_id) {
      num++;
      getResp = await client.apps.datastore.get<
        typeof usertime.definition
      >({
        datastore: usertime.name,
        id: num.toString(),
      });
    }

    const getHackatime = await fetch("https://hackatime.hackclub.com/api/v1/users/current/statusbar/today", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${inputs.apikey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await getHackatime.json();

    const hoursSlack = getResp.item.timeOnline / 60;
    const minSlack = getResp.item.timeOnline % 60;

    const seconds = data.data.grand_total.total_seconds;
    const hourshack = Math.floor(seconds / 3600);
    const minshack = Math.floor((seconds % 3600) / 60);

    const airesponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${"sk-mnopqrstijkl5678mnopqrstijkl5678mnopqrst"}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "system",
            "content": "You are Sans, a lazy, pun-loving skeleton monster in Undertale who loves to annoy his energetic brother Papyrus and initially appears as a friendly supporting character but is secretly a powerful, observant figure aware of the user's actions and resets. As it is fall, you only make fall-season puns, jokes, and comments.",
          },
          { "role": "user", 
            "content": `The user is a Hack Club member who has spent ${getResp.item.timeOnline} seconds on Hack Club Slack, a messaging platform for all Hack Clubbers, and spent ${seconds} seconds coding today. Could you provide some comments fitting your character in fall season. Try to encourage the user to either do better if they spent more time on Slack than Hackatime (because it's better to do more coding than texting after all), or to congratulate them and try and get them to spend more time on Hackatime if they spent more time on Hackatime.`,
          },
        ],
      }),
    });

    const thedata = await airesponse.json();
    const text = thedata.choices[0].message.content;

    await client.chat.postMessage({
      channel: inputs.channel,
      text: `Hey <@${inputs.user}>, here are your stats for today:\nTime spent on Slack: ${hoursSlack} hours and ${minSlack}.\nHackatime stats: ${hourshack} hours and ${minshack} minutes on Hackatime.\n\n`,
    });



    return { outputs: {} };
  },
);
