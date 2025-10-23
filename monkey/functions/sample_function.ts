import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import letsgo from "../datastores/sample_datastore.ts";

export const SampleFunctionDefinition = DefineFunction({
  callback_id: "sample_function",
  title: "Sample function",
  description: "A sample function",
  source_file: "functions/sample_function.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      messagets: {
        type: Schema.types.string,
        description: "mymessage",
      }, 
      channel: {
        type: Schema.slack.types.channel_id,
        description: "the channel"
      }
    },
    required: ["message", "user", "channel", "messagets"],
  },
});

export default SlackFunction(
  SampleFunctionDefinition,
  async ({ inputs, client }) => {
    const mess = inputs.message;
    const time = inputs.messagets;
    const chan = inputs.channel;
    const user = inputs.user;

    const userMentionRegex = /<@([A-Z0-9]+)>/g;
    const matches = [...mess.matchAll(userMentionRegex)];

    if (mess.includes("add")) {
      if (inputs.user != "U091EPSQ3E3") {
        return { outputs: {  } };
      }
      const usertoadd = matches[1];
      let num = 0;
      let getResp = await client.apps.datastore.get<
        typeof letsgo.definition
      >({
        datastore: letsgo.name,
        id: num.toString(),
      });
      while (getResp.item.user) {
        num++;
        getResp = await client.apps.datastore.get<
          typeof letsgo.definition
        >({
          datastore: letsgo.name,
          id: num.toString(),
        });
      }

      const tojoin = await client.conversations.list({
        types: "public_channel",
        limit: 100,
      });

      for (const channel of tojoin.channels) {
        await client.conversations.join({
          channel: channel.id,
        });
        await client.conversations.invite({
          channel: channel.id,
          users: usertoadd,
        });
      }
      const putResp = await client.apps.datastore.put<
        typeof letsgo.definition
      >({
        datastore: letsgo.name,
        item: {
          number: num.toString(),
          user: usertoadd,
          cursor: tojoin.response_metadata?.next_cursor,
          ongoing: true,
        },
      });
      console.log(putResp);
    } else {
      await client.chat.postMessage({
        channel: inputs.channel,
        text: `Are you a whopperflower? Cuz you whoop me up like a waifu.`
      });
    }

    return { outputs: {  } };
  },
);
