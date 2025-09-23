import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { reactFunct } from "../functions/anonre.ts";

const anonReact = DefineWorkflow({
  callback_id: "anon_react",
  title: "Anonymous React",
  description: "Anonymously react to a message",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      }
    },
    required: ["interactivity"],
  },
});

const form = anonReact.addStep(Schema.slack.functions.OpenForm,
  {
      title: "Anonymous React",
      interactivity: anonReact.inputs.interactivity,
      submit_label: "React anonymously!",
      description: "Anonymously react to a message (it can be any message)!",
      fields: {
        elements: [{
          name: "linkmessage",
          title: "What message to react to?",
          description: "Provide the link to the message",
          type: Schema.types.string,
        },
        {
          name: "reaction",
          title: "What reaction to add?",
          description: "Please provide the emoji name only",
          type: Schema.types.string,
        }],
        required: ["linkmessage", "reaction"],
      },
    },
);

anonReact.addStep(reactFunct, {
  message: form.outputs.fields.linkmessage,
  reaction: form.outputs.fields.reaction,
  user_id: anonReact.inputs.user_id,
});

export default anonReact;
