import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const channelCheck = DefineFunction({
  callback_id: "channel_check",
  title: "T in Channel",
  description: "Notify if a target is in a specific channel",
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
    },
    required: ["message", "channel_id"],
  },
});

export default SlackFunction(
  channelCheck,
  async ({ inputs, client }) => {
    const myMessage = `${inputs.message}`;
    let cursor: string | undefined = undefined;
    const matches = myMessage.match(/<([^>]+)>/g);
    console.log("getID:" , matches);
    let target_id = "";
    if (matches && matches.length >= 2) {
      target_id = matches[1]?.replace("<@", "").replace(">", "");
    } else {
      return { outputs: { error: "Please provide user_id" } };
    }
    if (target_id) {
      console.log("target:" , target_id);
    }
    const channel = matches[2]?.replace("<#", "").replace(">", "");
    const place = await client.conversations.members({
      channel: channel,
      cursor: cursor,
    });
    if (place.ok) {
      console.log(place);
    }

    let result = false;
    do {
      if (place.members && place.members.includes(target_id)) {
        result = true;
        break;
      }
      if (place.response_metadata?.next_cursor) {
        cursor = place.response_metadata.next_cursor;
      }
    } while (place?.response_metadata?.next_cursor);

    if (result) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: `<@${target_id}> is in <#${channel}>`,
      });
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: `<@${target_id}> is not in <#${channel}>`,
      });
    }

    return { outputs: {} };
  },
);