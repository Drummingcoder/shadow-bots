import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const WelcomeMessageFunction = DefineFunction({
  callback_id: "welcome_message_function",
  title: "Create Welcome Message",
  source_file: "functions/welcome_message_function.ts",
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