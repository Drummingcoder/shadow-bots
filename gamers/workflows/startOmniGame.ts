import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { starteOmni } from "../functions/startOmniRps.ts";

const startOmni = DefineWorkflow({
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

const form = startOmni.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Rock, Paper, Scissors",
    interactivity: startOmni.inputs.interactivity,
    submit_label: "Start!",
    description: "Still a Work in Progress!",
    fields: {
      elements: [
      {
        name: "player2",
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
      required: ["player2", "channel"],
    },
  },
);

startOmni.addStep(starteOmni, {
  other_user: form.outputs.fields.player2,
  channel: form.outputs.fields.channel,
  user_id: startOmni.inputs.user_id,
  interactivity: form.outputs.interactivity,
});

export default startOmni;
