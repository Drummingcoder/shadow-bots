import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import trackUsers from "../datastores/users.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import letsmakethe from "../workflows/runreminder.ts";
import nodupreminds from "../datastores/havereminder.ts";

export const mymessagedaily = DefineFunction({
  callback_id: "letscreate",
  title: "Create the trigger!",
  description: "Let's create the daily reminder",
  source_file: "functions/createmessage.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "channel to post the message in",
      },
      time: {
        type: Schema.types.string,
        description: "what time to run",
      },
      timezone: {
        type: Schema.types.string,
        description: "What time to operate on",
      },
      apikey: {
        type: Schema.types.string,
      },
      date: {
        type: Schema.slack.types.date,
      },
    },
    required: ["user", "channel", "time", "timezone"],
  },
});

export default SlackFunction(
  mymessagedaily,
  async ({ inputs, client }) => {
    const getResp = await client.apps.datastore.get<
      typeof trackUsers.definition
    >({
      datastore: trackUsers.name,
      id: inputs.user,
    });

    if (!getResp.item.tracking) {
      await client.chat.postEphemeral({
        channel: inputs.channel,
        user: inputs.user,
        text: "Please register for Sans time tracking if you want this daily reminder. Read the docs for instructions on how to do so."
      });
      return { outputs: { }};
    }

    const getname = await client.users.info({
      user: inputs.user,
    });

    const checkpls = await client.apps.datastore.get<
      typeof nodupreminds.definition
    >({
      datastore: nodupreminds.name,
      id: inputs.user,
    });

    if (checkpls.item.havereminder) {
      await client.chat.postEphemeral({
        channel: inputs.channel,
        user: inputs.user,
        text: "You can't create another reminder! (just yet)"
      });
      return { outputs: { }};
    }

    const time = `${inputs.date}T${inputs.time}:00`;
    console.log(getname);

    const trigger = await client.workflows.triggers.create({
      name: `Daily Update for ${getname.user.profile.real_name}`,
      workflow: `#/workflows/${letsmakethe.definition.callback_id}`,
      type: TriggerTypes.Scheduled,
      inputs: {
        channel_id: { value: inputs.channel },
        apikey: { value: inputs.apikey },
        user: { value: inputs.user },
      },
      schedule: {
        start_time: time,
        timezone: inputs.timezone,
        frequency: {
          type: "daily",
          repeats_every: 1,
        },
      },
    });

    console.log(trigger);

    await client.chat.postEphemeral({
      channel: inputs.channel,
      user: inputs.user,
      text: "The reminder has been created.",
    });
    return { outputs: { }};
  },
);
