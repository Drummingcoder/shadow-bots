import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import usertime from "../datastores/timeusers.ts";
import theonechecker from "../datastores/response.ts";

export const messenger = DefineFunction({
  callback_id: "responses",
  title: "Respond to a thread",
  description: "A function to respond to threaded messages",
  source_file: "functions/messger.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "channel to post the message in",
      },
      messagets: {
        type: Schema.types.string,
        description: "The timestamp of the message",
      },
      threadpin: {
        type: Schema.types.string,
        description: "where to pin bud",
      }
    },
    required: ["message", "user", "channel" ],
  },
});

export default SlackFunction(
  messenger,
  async ({ inputs, client }) => {
    const getmyResp = await client.apps.datastore.get<
      typeof theonechecker.definition
    >({
      datastore: theonechecker.name,
      id: inputs.messagets,
    });

    console.log("thread:", inputs.threadpin);
    console.log("message:", inputs.messagets);

    if (getmyResp.item.responded && inputs.user != "U09HU7HMSNP") {
      const dayPattern = /^day \d+:/;
      if (dayPattern.test(inputs.message.toLowerCase())) {
        const test = await client.pins.add({
          channel: inputs.channel,
          timestamp: inputs.threadpin,
        });
        console.log(test);
      }

      const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `The user is a Hack Club member who said this about their day: ${inputs.message}. Could you make a story fitting Sans (from Undertale) in fall season that tries to comfort them if they're having a bad day or have fun if they're having a good day? Try to make the user happier. Make some bad jokes, some bad puns, just be Sans. Please provide around a 300 word response without any headers or titles.`}
          ],
          max_tokens: 500, 
          temperature: 0.8,
        }),
      });
      const thedata = await airesponse1.json();
      console.log(thedata);
      const text = thedata.result.response.trim();

      if (thedata.result) {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: `Nice, this is what I have to say about that: \n${text}`,
          thread_ts: inputs.messagets,
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          text: "Received. There was a problem with the AI.",
          thread_ts: inputs.messagets,
        });
      }

      await client.apps.datastore.update<
        typeof theonechecker.definition
      >({
        datastore: theonechecker.name,
        item: {
          threadts: inputs.messagets,
          responded: false,
        },
      });

      return { outputs: { } };
    }

    const userID = inputs.user;
    const message = inputs.message;
    const mests = inputs.messagets;

    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: userID,
    });

    if ((mests != getResp.item?.messagets) || !mests) {
      return { outputs: {} };
    }

    if (getResp.item?.tracking) {
      if (!getResp.item?.step) {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "You're already being tracked bud, lemme go to sleep."
        });
      }
    } else if ((!getResp.item?.step) || getResp.item?.step == 0) {
      return { outputs: {} };
    } else if (getResp.item?.step == 1) {
      if (message.toLowerCase() == "yes" || message.toLowerCase() == "y") {
        const yo = await client.users.getPresence({
          user: userID,
        });
        if (yo.presence == "away") {
          await client.chat.postMessage({
            channel: inputs.channel,
            thread_ts: inputs.messagets,
            text: "There are rules to my tracking, you can't manual set your presence to away like that. What, scared of a green light on your profile? I need that to track you ya know? So uh, kindly turn it on for me?"
          });
        }
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "So, have you read the rules yet?"
        });
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 2,
            coins: 0,
            messagets: mests,
          },
        });
        console.log(putResp);
      } else if (message.toLowerCase() == "no" || message.toLowerCase() == "n") {
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 0,
            coins: 0,
            messagets: "",
          },
        });
        console.log(putResp);
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "Don't worry about it, this isn't for everyone. :wink:"
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "That's not a valid answer. Haa...do you really want to have a bad time?"
        });
        return { outputs: {} };
      }
    } else if (getResp.item?.step == 2) {
      if (message.toLowerCase() == "yes" || message.toLowerCase() == "y") {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "If you have, you probably know what's next right? This is your final chance to back out. Once you're in, there's no out. Do you want to go forward?"
        });
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 3,
            coins: 0,
            messagets: mests,
          },
        });
        console.log(putResp);
      } else if (message.toLowerCase() == "no" || message.toLowerCase() == "n") {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: `The rules are simple, don't automatically set yourself as away, and just continue to use Slack normally. I will give you a coin for every hour you spend off Slack (minus 7 hours for sleep time). I operate in PST, so don't expect coins until 12:00 am PST. I will ping you every half an hour reminding you your time on Slack in <#${"C09GDF8ETQB"}>, but you can spend coins to avoid the ping. Use the command '/timetospend' to spend your coins. \n\nThat's it for the rules, do you want to continue?`
        });
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 3,
            coins: 0,
            messagets: mests,
          },
        });
        console.log(putResp);
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "That's not a valid answer. Haa...do you really want to have a bad time?"
        });
        return { outputs: {} };
      }
    } else if (getResp.item?.step == 3) {
      if (message.toLowerCase() == "yes" || message.toLowerCase() == "y") {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "Alright, there's no backing out now. Good luck to you..."
        });
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: true,
            step: 0,
            coins: 0,
            messagets: "",
          },
        });
        console.log(putResp);

        let num = 0
        let getResp2 = await client.apps.datastore.get<
          typeof usertime.definition
        >({
          datastore: usertime.name,
          id: num.toString(),
        });

        while (getResp2.item?.user_id && getResp2.item?.user_id != null) {
          num++;
          getResp2 = await client.apps.datastore.get<
            typeof usertime.definition
          >({
            datastore: usertime.name,
            id: num.toString(),
          });
        }

        const putResp2 = await client.apps.datastore.put<
          typeof usertime.definition
        >({
          datastore: usertime.name,
          item: {
            number: num.toString(),
            user_id: userID,
            timeOnline: 0,
            timeOffline: 0,
          },
        });
        console.log(putResp2);
      } else if (message.toLowerCase() == "no" || message.toLowerCase() == "n") {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: `Ok pal, I'll just be over at Grillby's then.`
        });
        const putResp = await client.apps.datastore.put<
          typeof trackUsers.definition
        >({
          datastore: trackUsers.name,
          item: {
            user_id: userID,
            tracking: false,
            step: 0,
            coins: 0,
            messagets: "",
          },
        });
        console.log(putResp);
      } else {
        await client.chat.postMessage({
          channel: inputs.channel,
          thread_ts: inputs.messagets,
          text: "That's not a valid answer. Haa...do you really want to have a bad time?"
        });
        return { outputs: {} };
      }
    }

    return { outputs: {} };
  },
);
