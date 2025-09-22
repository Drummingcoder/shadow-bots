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
    if ((inputs.message.includes("kys") || inputs.message.includes("kill yourself")) || (inputs.message.includes("leave"))) {
      await client.conversations.leave({
        channel: inputs.channel_id,
      });
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "I have left the channel. If you want me to rejoin, please invite me again!",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { } };
    }
    const myMessage = `${inputs.message}`;
    let cursor: string | undefined = undefined;
    let realID = true;
    const matches = myMessage.match(/<([^>]+)>/g);
    console.log("getID:" , matches);
    let target_id = "";
    const userMatch = myMessage.match(/user:(\w+)/);
    console.log("userID:" , userMatch);
    if (matches && matches.length > 2) {
      target_id = matches[1]?.replace("<@", "").replace(">", "");
    } else if ((matches && matches.length == 2) && (userMatch && userMatch.length >= 1)) {
      target_id = userMatch[1];
      realID = false;
    } else {
      if (myMessage.includes("fuck") && ((myMessage.includes("u") || myMessage.includes("you")) || myMessage.includes("Jester"))) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: "You wanna do it with me? UwU",
          thread_ts: inputs.timestamp,
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: "Sorry, this response isn't supported yet.",
          thread_ts: inputs.timestamp,
        });
      }
      return { outputs: { error: "Please provide user_id" } };
    }
    if (target_id) {
      console.log("target:" , target_id);
    }
    let channel = [""];
    if (realID) {
      channel = matches[2]?.split("|");
    } else {
      channel = matches[1]?.split("|");
    }
    console.log("channel:" , channel);
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
    if (realID) {
      if (place.members && place.members.includes(target_id)) {
        result = true;
      }
    } else {
      if (place.members) {
        for (const member of place.members) {
          const userInfo = await client.users.info({ user: member });
          if (userInfo.ok && (userInfo.user?.profile.real_name.toLowerCase() === target_id.toLowerCase() || userInfo.user?.profile.display_name.toLowerCase() === target_id.toLowerCase())) {
            result = true;
            break;
          }
          console.log("user:", userInfo);
        }
      }
    }
    
    do {
      if (place.response_metadata?.next_cursor) {
        cursor = place.response_metadata.next_cursor;
        place = await client.conversations.members({
          channel: theChannel,
          cursor: cursor,
        });
      }
      if (realID) {
        if (place.members && place.members.includes(target_id)) {
          result = true;
        }
      } else {
        if (place.members) {
          for (const member of place.members) {
            const userInfo = await client.users.info({ user: member });
            if (userInfo.ok && userInfo.user?.name.toLowerCase() === target_id.toLowerCase()) {
              result = true;
              break;
            }
          }
        }
      }
    } while (place?.response_metadata?.next_cursor);

    if (result) {
      if (realID) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `Yes, <@${target_id}> is in <#${theChannel}>`,
          thread_ts: inputs.timestamp,
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `Yes, ${target_id} is in <#${theChannel}>`,
          thread_ts: inputs.timestamp,
        });
      }
    } else {
      if (realID) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `No, <@${target_id}> is not in <#${theChannel}>`,
          thread_ts: inputs.timestamp,
        });
      } else {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `No, ${target_id} is not in <#${theChannel}>`,
          thread_ts: inputs.timestamp,
        });
      }
    }

    return { outputs: {} };
  },
);