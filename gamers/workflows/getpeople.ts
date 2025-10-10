import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { dome } from "../functions/addpeople.ts";

const getDeath = DefineWorkflow({
  callback_id: "adding",
  title: "Add to",
  description: "Let's all play Death by AI!",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
      },
      messagets: {
        type: Schema.types.string,
      },
      threadts: {
        type: Schema.types.string,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      }, 
      message: {
        type: Schema.types.string,
      }
    },
    required: ["channel", "threadts", "messagets"],
  },
});

getDeath.addStep(dome, {
  channel: getDeath.inputs.channel,
  user_id: getDeath.inputs.user,
  messagets: getDeath.inputs.messagets,
  threadts: getDeath.inputs.threadts,
  message: getDeath.inputs.message,
});

export default getDeath;
