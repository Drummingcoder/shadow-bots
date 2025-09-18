import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

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
    await client.chat.postMessage({
      channel: inputs.channel_id,
      text: "Checking...",
      thread_ts: inputs.timestamp,
    });
    const myMessage = `${inputs.message}`;
    let cursor: string | undefined = undefined;
    const matches = myMessage.match(/<([^>]+)>/g);
    console.log("getID:" , matches);
    let target_id = "";
    if (matches && matches.length >= 2) {
      target_id = matches[1]?.replace("<@", "").replace(">", "");
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Sorry, this response isn't supposed yet.",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { error: "Please provide user_id" } };
    }
    if (target_id) {
      console.log("target:" , target_id);
    }
    const channel = matches[2]?.split("|");
    const theChannel = channel[0].replace("<#", "");

    let place = await client.conversations.members({
      channel: theChannel,
      cursor: cursor,
    });
    if (place.ok) {
      console.log(place);
    } else {
      console.log("Error fetching members:", place);
    }

    let result = false;
    if (place.members && place.members.includes(target_id)) {
      result = true;
    }
    do {
      if (place.response_metadata?.next_cursor) {
        cursor = place.response_metadata.next_cursor;
        place = await client.conversations.members({
          channel: theChannel,
          cursor: cursor,
        });
      }
      if (place.members && place.members.includes(target_id)) {
        result = true;
        break;
      }
    } while (place?.response_metadata?.next_cursor);

    if (result) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: `Yes, <@${target_id}> is in <#${theChannel}>`,
        thread_ts: inputs.timestamp,
      });
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: `No, <@${target_id}> is not in <#${theChannel}>`,
        thread_ts: inputs.timestamp,
      });
    }

    return { outputs: {} };
  },
);