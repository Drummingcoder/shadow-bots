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
    const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    const salutation =
      salutations[Math.floor(Math.random() * salutations.length)];
    const greeting =
      `${salutation}, <@${new_member}>! :wave: Welcome to the channel!`;
    return { outputs: { message: greeting } };
  },
);