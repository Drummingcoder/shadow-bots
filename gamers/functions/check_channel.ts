import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const channelCheck = DefineFunction({
  callback_id: "talker_yapper",
  title: "Small Talk",
  description: "Just a couple of fun facts!",
  source_file: "functions/check_channel.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be check",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel ID",
      },
      timestamp: {
        type: Schema.types.string,
        description: "Timestamp reply",
      },
    },
    required: ["message", "channel_id", "timestamp"],
  },
});

export default SlackFunction(
  channelCheck,
  async ({ inputs, client }) => {
    if ((inputs.message.includes("kys") || inputs.message.includes("kill yourself")) || (inputs.message.includes("leave"))) {
      await client.conversations.leave({
        channel: inputs.channel_id,
      });
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Leaving the channel... Bye!",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { } };
    }
    const myMessage = `${inputs.message}`;
    if (myMessage.includes("fuck") && ((myMessage.includes("u") || myMessage.includes("you")) || myMessage.includes("Dokeshi"))) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "You wanna do it with me? UwU",
        thread_ts: inputs.timestamp,
      });
    } else if (((myMessage.includes("fun fact") || myMessage.includes("fun facts")) || (myMessage.includes("u") || myMessage.includes("you"))) || myMessage.includes("Dokeshi")) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `Dokeshi is 6'7", has 420 friends, has parents that are 41 years old, and touched the hearts of 69 people!`,
          thread_ts: inputs.timestamp,
        });
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Sorry, this response isn't supported yet.",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { error: "Please provide a supported message" } };
    }

    return { outputs: {} };
  },
);