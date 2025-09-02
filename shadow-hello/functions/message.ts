import { DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";

export const welcomeMessage = DefineFunction({
  callback_id: "welcome",
  title: "Dark_welcome",
  source_file: "functions/message.ts",
  input_parameters: {
    properties: {
      new_member: { type: Schema.slack.types.user_id },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["new_member", "interactivity"],
  },
  output_parameters: {
    properties: {
      message: { type: Schema.types.string },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["message", "interactivity"],
  },
});

export default SlackFunction(
  welcomeMessage,
  ({ inputs }) => {
    const { new_member } = inputs;
    const warmgreeting = `Hi <@${new_member}>! Welcome to the place that lies between the zenith and the abyss. \nFeel free to post or talk about anything you like! (and follow the Code of Content of course)\n
    `;
    return { outputs: { message: warmgreeting, interactivity: inputs.interactivity } };
  },
);