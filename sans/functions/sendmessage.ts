import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import theonechecker from "../datastores/response.ts";
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

    const getHackatime = await fetch(`https://hackatime.hackclub.com/api/hackatime/v1/users/current/statusbar/today`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${inputs.apikey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await getHackatime.json();
    console.log(data);

    const hoursSlack = Math.floor(getResp.item.timeOnline / 60);
    const hoursSlackdec = getResp.item.timeOnline / 60;
    const minSlack = getResp.item.timeOnline % 60;

    const seconds = data.data.grand_total.total_seconds;
    const hourshack = Math.floor(seconds / 3600);
    const hoursdecimal = seconds / 3600.0;
    const minshack = Math.floor((seconds % 3600) / 60);

    const airesponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${"AIzaSyB8Kni3A8SOQPL2aCDd2uMIPRIiFHGcilE"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `The user is a Hack Club member who has spent ${hoursSlackdec} hours on Slack messaging and ${hoursdecimal} hours coding today. Could you provide some comments fitting Sans (from Undertale) in fall season. Try to encourage the user to either do better or to congratulate them and help them spend more time on Hackatime. Please provide a short 100-word response without any headers, titles, or extra punctuation.` }],
          },
        ],
      }),
    });
    const thedata = await airesponse.json();
    console.log(thedata);
    const text = thedata.candidates[0].content.parts[0].text;

    const threadfirst = await client.chat.postMessage({
      channel: inputs.channel,
      text: `Hey <@${inputs.user}>, here are your stats for today:\nTime spent on Slack: ${hoursSlack} hours and ${minSlack} minutes.\nHackatime stats: ${hourshack} hours and ${minshack} minutes.\n\nHere's what I think: ${text}`,
    });

    await client.chat.postMessage({
      channel: inputs.channel,
      text: "Tell us about your day, and don't be shy!",
      thread_ts: threadfirst.ts,
    });

    await client.apps.datastore.put<
      typeof theonechecker.definition
    >({
      datastore: theonechecker.name,
      item: {
        threadts: threadfirst.ts,
        responded: true,
      },
    });

    return { outputs: {} };
  },
);
