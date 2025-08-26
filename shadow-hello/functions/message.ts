import { DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";

export const welcomeMessage = DefineFunction({
  callback_id: "welcome",
  title: "Dark_welcome",
  source_file: "functions/message.ts",
  input_parameters: {
    properties: {
      new_member: { type: Schema.slack.types.user_id },
    },
    required: ["new_member"],
  },
  output_parameters: {
    properties: {
      message: { type: Schema.types.string },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  welcomeMessage,
  ({ inputs }) => {
    const { new_member } = inputs;
    const warmgreeting = `Hi <@${new_member}>! Welcome to the place that lies between the zenith and the abyss. \nWhether you're on the top of the world, or in your darkest times, I'm always here to help. \nOr if you need to chill from the pressures of society, you can do that here as well. \nAnd as always, feel free to post anything you like! (just don't get me banned :eyes_shaking:)\n\n\n\nOn an additional note, feel free to take a look at the canvases and add anything you like!\nI'm working on giving them more content, so they're a WIP.\n
    `;
    return { outputs: { message: warmgreeting } };
  },
);