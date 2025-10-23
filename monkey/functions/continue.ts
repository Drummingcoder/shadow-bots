import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import letsgo from "../datastores/sample_datastore.ts";
import letsnotgo from "../datastores/rate.ts";

export const comeonseeya = DefineFunction({
  callback_id: "continuing",
  title: "Let's keep joining",
  description: "Anything leftover will continue",
  source_file: "functions/continue.ts",
  input_parameters: {
    properties: {
    },
    required: [],
  },
});

export default SlackFunction(
  comeonseeya,
  async ({ inputs, client }) => {
    const getResp1 = await client.apps.datastore.get<
      typeof letsnotgo.definition
    >({
      datastore: letsnotgo.name,
      id: "adder",
    });

    if (getResp1.item.limited == true) {
      if (getResp1.item.count < 2) {
        await client.apps.datastore.update<
          typeof letsnotgo.definition
        >({
          datastore: letsnotgo.name,
          item: {
            therate: "adder",
            count: (getResp1.item.count + 1),
          },
        });
      } else {
        await client.apps.datastore.update<
          typeof letsnotgo.definition
        >({
          datastore: letsnotgo.name,
          item: {
            therate: "adder",
            limited: false,
            count: 0,
          },
        });
      }
      return {outputs: {}};
    }

    let num = 0;
    let getResp = await client.apps.datastore.get<
      typeof letsgo.definition
    >({
      datastore: letsgo.name,
      id: num.toString(),
    });
    while (! getResp.item.ongoing) {
      num++;
      getResp = await client.apps.datastore.get<
        typeof letsgo.definition
      >({
        datastore: letsgo.name,
        id: num.toString(),
      });
    }

    if (!getResp.item.user) {
      return { outputs: {} }; 
    }

    const tojoin = await client.conversations.list({
      types: "public_channel",
      limit: 100,
      cursor: getResp.item.cursor,
    });

    if (! tojoin.ok) {
      const putResp = await client.apps.datastore.update<
        typeof letsnotgo.definition
      >({
        datastore: letsnotgo.name,
        item: {
          therate: "adder",
          limited: true,
          count: 0,
        },
      });
      console.log(putResp)
      return {outputs: {}};
    }

    for (const channel of tojoin.channels) {
      await client.conversations.join({
        channel: channel.id,
      });
      await client.conversations.invite({
        channel: channel.id,
        users: getResp.item.user,
      });
    }

    if (tojoin.response_metadata?.next_cursor) {
      const putResp = await client.apps.datastore.update<
        typeof letsgo.definition
      >({
        datastore: letsgo.name,
        item: {
          number: num.toString(),
          cursor: tojoin.response_metadata?.next_cursor,
        },
      });
      console.log(putResp);
    } else {
      const putResp = await client.apps.datastore.update<
        typeof letsgo.definition
      >({
        datastore: letsgo.name,
        item: {
          number: num.toString(),
          cursor: "",
          ongoing: false,
        },
      });

      console.log(putResp);
    }
    
    return { outputs: {  } };
  },
);
