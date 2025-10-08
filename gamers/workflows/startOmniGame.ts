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
    title: "Omniscient RPS",
    interactivity: startOmni.inputs.interactivity,
    submit_label: "Start!",
    description: "You can use literally anything in this game!",
    fields: {
      elements: [
      {
        name: "player2",
        title: "Who to play against?",
        description: "Who is going to be your opponent? (leave blank to play alone)",
        type: Schema.slack.types.user_id,
      },
      {
        name: "channel",
        title: "What channel to play in?",
        description: "Pick any channel!",
        type: Schema.slack.types.channel_id,
      },
      {
        name: "mode",
        title: "What mode?",
        description: "One toss means you only throw only one answer (like RPS). Multiple answers means you keep going until one of you loses (see canvas for more details).",
        type: Schema.types.string,
        enum: ["one_toss", "multiple_answers"],
        choices: [
          {
            value: "one_toss",
            title: "One Toss",
            description: "Single round like traditional RPS"
          },
          {
            value: "multiple_answers", 
            title: "Multiple Answers",
            description: "Keep playing until someone loses"
          }
        ]
      }
    ],
      required: ["channel"],
    },
  },
);

startOmni.addStep(starteOmni, {
  other_user: form.outputs.fields.player2,
  channel: form.outputs.fields.channel,
  user_id: startOmni.inputs.user_id,
  interactivity: form.outputs.interactivity,
  mode: form.outputs.fields.mode,
});

export default startOmni;
