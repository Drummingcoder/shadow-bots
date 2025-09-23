import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import emojiuser from "../datastores/emoji.ts";

export const goannoy = DefineFunction({
  callback_id: "reactsannoy",
  title: "Annoy Pls",
  description: "React to someone's message all the time",
  source_file: "functions/reactannoy.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel of message",
      },
      timestamp: {
        type: Schema.types.string,
        description: "Timestamp of message",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
    },
    required: ["channel_id", "timestamp", "user_id"],
  },
});

export default SlackFunction(
  goannoy,
  async ({ inputs, client }) => {
    const getRe = await client.apps.datastore.get <
      typeof emojiuser.definition
      > (
          {
              datastore: emojiuser.name,
              id: inputs.user_id,
          },
    );

    console.log(getRe);
    
    if (getRe.item.emoji) {
      const re = await client.reactions.add({
        channel: inputs.channel_id,
        name: getRe.item.emoji,
        timestamp: inputs.timestamp,
      });
      console.log(re);
    }

    return { outputs: {} };
  },
);