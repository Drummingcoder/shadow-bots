import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const check = DefineFunction({
  callback_id: "check_step",
  title: "Conditional Check",
  description: "Matching string to return values",
  source_file: "functions/check_step.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      strin: {
        type: Schema.types.string,
        description: "check format",
      },
    },
    required: ["strin"],
  },
});

export default SlackFunction(
  check,
  ({ inputs, client }) => {
    const _pattern = /^<@([A-Z0-9]+)> is <@([A-Z0-9]+)> in <#([A-Z0-9]+)\|[^>]*>\?$/;
    console.log(inputs.message);

    if (inputs.message.includes("add to all channels")) {
      return { outputs: { strin: "AddAll" } };
    }

    if (inputs.message.includes("in")) {
      return { outputs: { strin: "Specific" } };
    }
    return { outputs: { strin: "General" } };
  },
);