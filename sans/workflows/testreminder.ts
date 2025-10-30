import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { othersend } from "../functions/sendmessage.ts";

const testremind = DefineWorkflow({
  callback_id: "testme",
  title: "Let's test ts out!",
  description: "Posts to channel a testing",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      }
    },
    required: ["user", "interactivity"],
  },
});

const form = testremind.addStep(Schema.slack.functions.OpenForm,
  {
    title: "Test a Reminder!",
    interactivity: testremind.inputs.interactivity,
    submit_label: "Let's go!",
    description: `Let's create a reminder! Make sure you being tracked using the Sans Tracker or else this won't work.`,
    fields: {
      elements: [
      {
        name: "apikey",
        title: "Hackatime API key",
        description: "You can get this from the Hackatime website!",
        type: Schema.types.string,
      },
    ],
      required: ["apikey"],
    },
  },
);

testremind.addStep(othersend, {
  user: testremind.inputs.user,
  apikey: form.outputs.fields.apikey,
  channel: testremind.inputs.channel,
});

export default testremind;
