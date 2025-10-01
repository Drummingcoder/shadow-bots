import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { messenger } from "../functions/first_messger.ts";

const first = DefineWorkflow({
  callback_id: "firstcontact",
  title: "Initial Contact",
  description: "The first message of the bot.",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      message: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      messagets: {
        type: Schema.types.string,
      },
    },
    required: ["user", "channel", "messagets"],
  },
});

first.addStep(messenger, {
  channel: first.inputs.channel,
  user: first.inputs.user,
  messagets: first.inputs.messagets,
});

export default first;
