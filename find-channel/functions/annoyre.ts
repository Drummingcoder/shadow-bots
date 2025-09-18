import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import emojiuser from "../datastores/emoji.ts";

export const annoyFunct = DefineFunction({
  callback_id: "annoyre",
  title: "Annoy Anonymously",
  description: "React to someone's message all the time",
  source_file: "functions/annoyre.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "User to annoy",
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
    required: ["user", "reaction", "user_id"],
  },
});

export default SlackFunction(
  annoyFunct,
  async ({ inputs, client }) => {
    
    const putResp = await client.apps.datastore.put<
      typeof emojiuser.definition
    >({
      datastore: emojiuser.name,
      item: {
        user_id: inputs.user,
        emoji: inputs.reaction,
      },
    });
    console.log(putResp);
    if (!putResp.ok) {
      await client.chat.postEphemeral({
        channel: "C09AHN6V1U7",
        user: inputs.user_id,
        text: `Something went wrong...`,
      });
    }

    return { outputs: {} };
  },
);