import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { _internals } from "deno-slack-api/base-client-helpers.ts";

export const start = DefineFunction({
  callback_id: "start_ga",
  title: "Start Game",
  description: "Start a game of Omniscient Rock, Paper, Scissors",
  source_file: "functions/reply.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to post in",
      },
      other_user: {
        type: Schema.slack.types.user_id,
        description: "opponent user",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user invoking app",
      },
    },
    required: ["channel", "other_user"],
  },
});

export default SlackFunction(
  start,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const firstText = await client.chat.postMessage({
      channel: channelToPost,
      text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to a game of Omniscient Rock, Paper, Scissors!`,
    });
    const challenge = await client.chat.postMessage({
      channel: channelToPost,
      thread_ts: firstText.ts,
      blocks: [
        {
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": inputs.message,
					}
				},
				{
					"type": "image",
					"image_url": inputs.image_url,
					"alt_text": "Welcome image"
				},
				{
					"type": "actions",
					"elements": [
						{
							"type": "button",
							"text": {
								"type": "plain_text",
								"text": "Declare your presence"
							},
							"value": inputs.channel_id,
							"action_id": "ping_me"
						}
					]
				}
      ],
    });

    return { outputs: {} };
  },
);