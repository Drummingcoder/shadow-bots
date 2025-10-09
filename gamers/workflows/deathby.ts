import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { startDeathGame } from "../functions/deathly.ts";

const startDeath = DefineWorkflow({
  callback_id: "death_by_ai",
  title: "Death by AI",
  description: "Let's play Death by AI!",
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

const form = startDeath.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Death by AI",
    interactivity: startDeath.inputs.interactivity,
    submit_label: "Start!",
    description: "Do you have what it takes to survive?",
    fields: {
      elements: [
      {
        name: "channel",
        title: "What channel to play in?",
        description: "Pick any channel!",
        type: Schema.slack.types.channel_id,
      },
    ],
      required: ["channel"],
    },
  },
);

startDeath.addStep(startDeathGame, {
  channel: form.outputs.fields.channel,
  user_id: startDeath.inputs.user_id,
  interactivity: form.outputs.interactivity,
});

export default startDeath;
