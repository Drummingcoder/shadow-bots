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
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  pingMe,
  async ({ inputs, client }) => {
    await client.chat.postMessage({
      channel: inputs.interactivity.channel.id,
      text: "@Shadowlight!",
    });
    return { 
      outputs: { 
        interactivity: inputs.interactivity 
      } 
    };
  }
);