import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { start } from "../functions/startRps.ts";

const starting = DefineWorkflow({
  callback_id: "omni_rps",
  title: "Omniscient Rock, Paper, Scissors",
  description: "What if you could use anything in a game of RPS?",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity"],
  },
});

const form = starting.addStep(Schema.slack.functions.OpenForm,
  {
      title: "Anonymous Message",
      interactivity: starting.inputs.interactivity,
      submit_label: "Send anonymously!",
      description: "Anonymously message or reply to a thread",
      fields: {
        elements: [
        {
          name: "Player 2",
          title: "Who to play against?",
          description: "Who is going to be your opponent?",
          type: Schema.slack.types.user_id,
        },
        {
          name: "channel",
          title: "What channel to play in?",
          description: "Pick any channel!",
          type: Schema.slack.types.channel_id,
        }
      ],
        required: ["Player 2", "channel"],
      },
    },
);

starting.addStep(start, {
  other_user: form.outputs.fields.Player_2,
  channel: form.outputs.fields.channel,
  user_id: starting.inputs.user_id,
});

export default starting;
