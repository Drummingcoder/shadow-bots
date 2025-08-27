import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const getImage = DefineFunction({
    callback_id: "get_image_function",
    title: "Get Image",
    source_file: "functions/get_image_function.ts",
    input_parameters: {
      properties: {
        new_member: { type: Schema.slack.types.user_id },
        interactivity: { type: Schema.slack.types.interactivity },
      },
    required: ["new_member", "interactivity"],
  },
  output_parameters: {
    properties: {
      image_url: { type: Schema.types.string },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["image_url", "interactivity"],
  },
});

export default SlackFunction(
  getImage,
  ({ inputs }) => {
    const { new_member } = inputs;
    const image_url =
      `https://img.freepik.com/free-vector/stylish-welcome-lettering-banner-join-with-joy-happiness_1017-57675.jpg?semt=ais_hybrid&w=740&q=80`;
    return { outputs: { image_url, interactivity: inputs.interactivity } };
  },
);