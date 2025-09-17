import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const reactFunct = DefineFunction({
  callback_id: "anonre",
  title: "React Anonymously",
  description: "React to a message anonymously",
  source_file: "functions/anonre.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message link to get info from",
      },
      reaction: {
        type: Schema.types.string,
        description: "Emoji",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
    },
    required: ["message", "reaction", "user_id"],
  },
});

export default SlackFunction(
  reactFunct,
  async ({ inputs, client }) => {
    const msglink = inputs.message.split("/");
    const channel_id = msglink[4];
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
    console.log(msglink, channel_id, realTs);
    
    const responce = await client.reactions.add({
      channel: channel_id,
      name: inputs.reaction,
      timestamp: realTs,
    });

    if (!responce.ok) {
      if (responce.error === "already_reacted") {
        const newre = await client.reactions.remove({
          channel: channel_id,
          name: inputs.reaction,
          timestamp: realTs,
        });
        console.log(newre);
      } else {
        await client.chat.postEphemeral({
          channel: channel_id,
          user: inputs.user_id,
          text: "Something went wrong.",
        });
      }
    }
    console.log(responce);

    return { outputs: {} };
  },
);