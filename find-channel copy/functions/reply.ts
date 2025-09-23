import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const mesFunct = DefineFunction({
  callback_id: "reply",
  title: "Reply Anonymously",
  description: "Post or reply anonymously",
  source_file: "functions/reply.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message link to get info from",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to post in",
      },
      reply_link: {
        type: Schema.types.string,
        description: "Message to reply to",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
    },
    required: ["message", "channel", "user_id"],
  },
});

export default SlackFunction(
  mesFunct,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const message = inputs.message;
    if (inputs.user_id != "U091EPSQ3E3") {
      return { error: "Unauthorized user" };
    }
    if (inputs.reply_link == "" || inputs.reply_link == undefined) {
      let toPost = message[0];
      const responce = await client.chat.postMessage({
        channel: channelToPost,
        text: toPost,
      });
      for (let i = 1; i < message.length; i++) {
        const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));
        await timeout(200);
        toPost += message[i];
        await client.chat.update({
          channel: channelToPost,
          text: toPost,
          ts: responce.ts,
        });
      }
      const response = await client.chat.update({
        channel: channelToPost,
        text: message + `\n\n -sent by <@${inputs.user_id}>`,
        ts: responce.ts,
      });
      console.log(response);
    } else {
      const msglink = inputs.reply_link.split("/");
      let timestamp = msglink[5];

      if (timestamp.includes("thread_ts=")) {
        const timearr = timestamp.split("?");
        timestamp = timearr[0].replace("p", "");
      } else {
        timestamp = timestamp.replace("p", "");
      }
      const seconds = timestamp.slice(0, 10);
      const microseconds = timestamp.slice(10);
      const realTs = `${seconds}.${microseconds}`;
      let toPost = message[0];
      const responce = await client.chat.postMessage({
        channel: channelToPost,
        text: toPost,
        thread_ts: realTs,
      });
      for (let i = 1; i < message.length; i++) {
        const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));
        await timeout(100);
        toPost += message[i];
        await client.chat.update({
          channel: channelToPost,
          text: toPost,
          ts: responce.ts,
        });
      }
      const response = await client.chat.update({
        channel: channelToPost,
        text: message + `\n\n -sent by <@${inputs.user_id}>`,
        ts: responce.ts,
      });
      console.log(response);
    }

    console.log("Person who sent message:", inputs.user_id);

    return { outputs: {} };
  },
);