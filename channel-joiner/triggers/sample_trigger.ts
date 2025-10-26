import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes, TriggerEventTypes } from "deno-slack-api/mod.ts";
import SampleWorkflow from "../workflows/sample_workflow.ts";

const sampleTrigger: Trigger<typeof SampleWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Mentiond",
  description: "A trigger that fires when the bot is mentioned",
  workflow: `#/workflows/${SampleWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.AppMentioned,
    all_resources: true,
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.AppMentioned.channel_id,
    },
    message: {
      value: TriggerContextData.Event.AppMentioned.text,
    },
    user: {
      value: TriggerContextData.Event.AppMentioned.user_id,
    },
    messagets: {
      value: TriggerContextData.Event.AppMentioned.message_ts,
    },
  },
};

export default sampleTrigger;
