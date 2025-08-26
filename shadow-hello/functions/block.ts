import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const blockMessage = DefineFunction({
    callback_id: "block_message",
    title: "Message",
    source_file: "functions/block.ts",
    input_parameters: {
        properties: {
            channel_id: { type: Schema.slack.types.channel_id },
			message: { type: Schema.types.string },
			image_url: {type: Schema.types.string },
			interactivity: { type: Schema.slack.types.interactivity },
        },
		required: ["channel_id", "message", "image_url", "interactivity"],
	},
	output_parameters: {
		properties: {
			interactivity: { type: Schema.slack.types.interactivity },
		},
		required: ["interactivity"],
	},
});

export default SlackFunction(
  blockMessage,
  async ({ inputs, client }) => {
	const blocks = {
		"blocks": [
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
				"alt_text": "cute cat"
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
						"value": "ping",
						"action_id": "ping_me"
					}
				]
			}
		]
	};
    await client.chat.postMessage({
      channel: inputs.channel_id,
      blocks: blocks.blocks,
    });
    return { outputs: { interactivity: inputs.interactivity } };
  }
);