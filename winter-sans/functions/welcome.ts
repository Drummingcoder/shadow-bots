import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const newmessenger = DefineFunction({
  callback_id: "welcomer",
  title: "Welcome to channel",
  description: "A function to welcome new people",
  source_file: "functions/welcome.ts",
  input_parameters: {
    properties: {
      inviter: {
        type: Schema.slack.types.user_id,
        description: "Message to be posted",
        default: "",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "channel to post the message in",
      }
    },
    required: ["user", "channel"],
  },
});

export default SlackFunction(
  newmessenger,
  async ({ inputs, client }) => {
    let invited = false;
    const rep1 = await client.users.info({
      user: inputs.user,
    });
    const userdisplay = rep1.user.profile?.display_name || rep1.user.profile?.real_name || "John Doe";
    let stringtoai = `This user just joined a Hack Club Slack channel that belongs to a dude named Shadowlight and he shares his daily adventures and his software projects (such as Slack bots and websites) and chills with friends in channel. As Sans from Undertale, welcome the user to the channel with some quirky jokes that are winter-themed and introduce them to what the channel is about and encourage them to chat freely and join the other personal channels in the Shadow Neighborhood canvas (they're not general channels like #general, but channels for people to talk about themselves), since they're all cool channels! Make some nice or quirky (you choose) remarks about their name (be respectful tho) ${userdisplay}. Make it around 125 words or less.`;
    if (inputs.inviter && inputs.inviter != "") {
      invited = true;
      const rep2 = await client.users.info({
        user: inputs.inviter,
      });
      const invitedname = rep2.user.profile?.display_name || rep2.user.profile?.real_name || "no one";
      stringtoai += ` This user was forced to join by ${invitedname}, so poke some fun at that or tease the person who "invited" (forced them) to join.`
    }
    const airesponse1 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${"de299eff7ceaa5006bd30245bd9a6c77"}/ai/run/${"@cf/meta/llama-3.1-8b-instruct"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${"trcWfRL7kg_P8I0Denn_tIngbsf1ZszdZ08In75F"}`, 
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: stringtoai }
        ],
        max_tokens: 500, 
        temperature: 0.8,
      }),
    });
    const thedata = await airesponse1.json();
    console.log(thedata);
    const text = thedata.result.response.trim();

    await client.chat.postMessage({
      channel: inputs.channel,
      text: text,
    });

    const chat = await client.conversations.open({
      users: "U091EPSQ3E3",
    });

    if (invited) {
      await client.chat.postMessage({
        channel: chat.channel.id,
        text: `<@${inputs.user}> joined your channel, invited by <@${inputs.inviter}>.`
      });
    } else {
      await client.chat.postMessage({
        channel: chat.channel.id,
        text: `<@${inputs.user}> joined your channel.`
      });
    }

    return { outputs: {} };
  },
);
