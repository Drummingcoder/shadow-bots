import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { InteractivityType } from "deno-slack-sdk/schema/slack/types/custom/interactivity.ts";

export const start = DefineFunction({
  callback_id: "start_ga",
  title: "Start Game",
  description: "Start a game of Omniscient Rock, Paper, Scissors",
  source_file: "functions/startRps.ts",
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
	  interactivity: {
		type: Schema.slack.types.interactivity,
		description: "Interactivity",
	  }
    },
    required: ["channel", "other_user", "user_id"],
  },
});

export default SlackFunction(
  start,
  async ({ inputs, client }) => {
    const channelToPost = inputs.channel;
    const firstText = await client.chat.postMessage({
      channel: channelToPost,
      text: `<@${inputs.user_id}> has challenged <@${inputs.other_user}> to a game of Rock, Paper, Scissors!`,
    });
    const _challenge = await client.chat.postMessage({
      channel: channelToPost,
      thread_ts: firstText.ts,
      blocks: [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Put your inputs in!",
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Player 1, go!"
					},
					"value": inputs.user_id,
					"action_id": "p1_input",
					"style": "primary"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Player 2, go!"
					},
					"value": inputs.other_user,
					"action_id": "p2_input",
					"style": "danger"
				}
			]
		}
      ],
    });

    return {
		completed: false,
		outputs: undefined,
	};
  },
).addBlockActionsHandler("p1_input", async ({ body, client }) => {
	const { actions } = body;
	if (!actions) return;
	
  const response = await client.views.open({
      interactivity_pointer: body.interactivity?.interactivity_pointer,
      view: {
          type: "modal",
          title: {
              type: "plain_text",
              text: "Your Move"
          },
          submit: {
              type: "plain_text",
              text: "Submit"
          },
          blocks: [
              {
                  type: "section",
                  text: {
                      type: "mrkdwn",
                      text: "Choose your move:"
                  }
              },
              {
                  type: "actions",
                  elements: [
                      {
                          type: "radio_buttons",
                          action_id: "rps_choice",
                          options: [
                              {
                                  text: { type: "plain_text", text: "Rock" },
                                  value: "rock"
                              },
                              {
                                  text: { type: "plain_text", text: "Paper" },
                                  value: "paper"
                              },
                              {
                                  text: { type: "plain_text", text: "Scissors" },
                                  value: "scissors"
                              }
                          ]
                      }
                  ]
              }
          ]
      }
  });
  console.log(response);

	return { completed: true, outputs: { interactivity: body.interactivity } };
});