import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const theMessage = DefineFunction({
  callback_id: "canvas_post",
  title: "Really",
  description: "Post a canvas with the list of channels the target is in",
  source_file: "functions/loop_user.ts",
  input_parameters: {
    properties: {
      place_var: {
        type: Schema.types.object,
      },
      cursor: {
        type: Schema.types.string,
      },
      target_id: {
        type: Schema.types.string,
      },
      target_channel: {
        type: Schema.types.string,
      },
      post_channel: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["place_var", "cursor", "target_id", "target_channel", "post_channel"],
  },
});

export default SlackFunction(
  theMessage,
  async ({ inputs, client }) => {
    let { place_var, cursor, target_id, target_channel, post_channel } = inputs;

    let result = false;
    do {
      if (place_var.members && place_var.members.includes(target_id)) {
        result = true;
        break;
      }
      if (place_var.response_metadata?.next_cursor) {
        cursor = place_var.response_metadata.next_cursor;
        place_var = await client.conversations.members({
          channel: target_channel,
          cursor: cursor,
        });
      }
    } while (place_var?.response_metadata?.next_cursor);
    
    if (result) {
      await client.chat.postMessage({
        channel: post_channel,
        text: `Yes, <@${target_id}> is in <#${target_channel}>`,
      });
    } else {
      await client.chat.postMessage({
        channel: post_channel,
        text: `No, <@${target_id}> is not in <#${target_channel}>`,
      });
    }

    return { outputs: {} };
  },
);