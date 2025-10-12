import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { getdeathrep } from "../functions/deathresponse.ts";

const playDeath = DefineWorkflow({
  callback_id: "playingDeath",
  title: "ResponseDeath",
  description: "Solving the scenario",
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

const form = playDeath.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Death by AI responder",
    interactivity: playDeath.inputs.interactivity,
    submit_label: "Go!",
    description: "Do you have what it takes to survive?",
    fields: {
      elements: [
        {
          name: "gamenum",
          title: "What channel to play in?",
          description: "Pick any channel!",
          type: Schema.types.number,
        },
        {
          name: "channel",
          title: "What channel are you playing in?",
          description: "This will be removed as the bot gets more advanced",
          type: Schema.slack.types.channel_id,
        },
        {
          name: "respond",
          title: "What will you do?",
          description: "This is where the user responds",
          type: Schema.types.string,
          long: true,
        },
        ],
      required: ["gamenum", "respond", "channel", "respond"],
    },
  },
);

playDeath.addStep(getdeathrep, {
  channel: form.outputs.fields.channel,
  user_id: playDeath.inputs.user_id,
  interactivity: form.outputs.interactivity,
  gamenum: form.outputs.fields.gamenum,
  respo: form.outputs.fields.respond,
});

export default playDeath;
