import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { annoyFunct } from "../functions/annoyre.ts";

const annoyReacter = DefineWorkflow({
  callback_id: "annoy_react",
  title: "Anonymous Annoy",
  description: "React to someone's message all the time!",
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

const form = annoyReacter.addStep(Schema.slack.functions.OpenForm,
  {
      title: "Anonymous Annoy",
      interactivity: annoyReacter.inputs.interactivity,
      submit_label: "Go!",
      description: "A user whose messages will always be reacted to. To remove the auto-react, just re-submit the same user and emoji.",
      fields: {
        elements: [{
          name: "user",
          title: "Who to react to?",
          description: "Provide the user_id",
          type: Schema.slack.types.user_id,
        },
        {
          name: "reaction",
          title: "What reaction to add?",
          description: "Please provide the emoji name only",
          type: Schema.types.string,
        }],
        required: ["user", "reaction"],
      },
    },
);

annoyReacter.addStep(annoyFunct, {
  user: form.outputs.fields.user,
  reaction: form.outputs.fields.reaction,
  user_id: annoyReacter.inputs.user_id,
});

export default annoyReacter;
