import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export default function getImage() {
  return DefineFunction({
    callback_id: "get_image_function",
    title: "Get Image",
    source_file: "functions/get_image_function.ts",
    input_parameters: {
      properties: {
      new_member: { type: Schema.slack.types.user_id },
    },
    required: ["new_member"],
  },
  output_parameters: {
    properties: {
      image_url: { type: Schema.types.string },
    },
    required: ["image_url"],
  },
})
};