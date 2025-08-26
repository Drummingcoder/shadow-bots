import { DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";

export const pingMe = DefineFunction({
  callback_id: "ping_me",
  title: "Ping Me",
  source_file: "functions/ping_me.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {
      message: { type: Schema.types.string },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  pingMe,
  async ({ inputs, client }) => {
    // Respond to the button click
    await client.chat.postMessage({
      channel: inputs.interactivity.channel.id,
      text: `<@${inputs.interactivity.user.id}> declared their presence!`,
    });
    return { outputs: {} };
  }
);