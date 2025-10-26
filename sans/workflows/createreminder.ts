import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { mymessagedaily } from "../functions/createmessage.ts";

const domake = DefineWorkflow({
  callback_id: "plsremind",
  title: "Create a daily reminder",
  description: "Takes channel, time, and api key and creates a new trigger",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      }
    },
    required: ["user", "interactivity"],
  },
});

const form = domake.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Spend Your Coins",
    interactivity: domake.inputs.interactivity,
    submit_label: "Create!",
    description: `Let's create a reminder! Make sure you being tracked using the Sans Tracker or else this won't work.`,
    fields: {
      elements: [
      {
        name: "channel",
        title: "What channel to post in?",
        description: "This should be your personal channel (or anywhere really, just don't spam).",
        type: Schema.slack.types.channel_id,
      },
      {
        name: "apikey",
        title: "Hackatime API key",
        description: "You can get this from the Hackatime website!",
        type: Schema.types.string,
      },
      {
        name: "time",
        title: "What time to send reminder?",
        description: "Enter this in your timezone, 24-hour time!",
        type: Schema.types.string,
      },
      {
        name: "timezone",
        title: "What is your timezone?",
        description: "Use the IANA Time Zone Database format!",
        type: Schema.types.string,
      },
      {
        name: "date",
        title: "What date to start?",
        description: "Please put a date so that this reminder starts in the future",
        type: Schema.slack.types.date,
      }
    ],
      required: ["apikey", "channel", "time", "timezone", "date"],
    },
  },
);

domake.addStep(mymessagedaily, {
  user: domake.inputs.user,
  channel: form.outputs.fields.channel,
  time: form.outputs.fields.time,
  timezone: form.outputs.fields.timezone,
  apikey: form.outputs.fields.apikey,
  date: form.outputs.fields.date,
});

export default domake;
