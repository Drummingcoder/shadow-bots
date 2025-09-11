import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const theMessage = DefineFunction({
  callback_id: "canvas_post",
  title: "Really",
  description: "Post a canvas with the list of channels the target is in",
  source_file: "functions/get_message.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  theMessage,
  async ({ inputs, client }) => {
    const myMessage = `${inputs.message}`;
    let allChannels: any[] = [];
    let cursor: string | undefined = undefined;
    let getID = myMessage.split(" ");
    console.log("getID:" , getID);
    const target_id = getID[1]?.replace("<@", "").replace(">", "");
    console.log("message:" , inputs.message);
    if (target_id) {
        console.log("target:" , target_id);
    }
    const result = [];

    do {
        const response = await client.conversations.list({
            types: "public_channel",
            limit: 100,
            cursor: cursor,
        });

        if (!response.ok || !Array.isArray(response.channels)) {
            console.log("End of channel list:", response);
            break;
        }

        for (const channel of response.channels) {
            const place = await client.conversations.members({
            channel: channel.id,
            cursor: cursor,
            });
            
            if (place.members && place.members.includes(target_id)) {
                result.push(channel.name);
            }
        }

        allChannels = allChannels.concat(response.channels);
        cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    let content = "List of channels <@" + target_id + "> is in:\n\n";
    for (const channel of result) {
      content += `#${channel}\n`;
    }
    console.log ("content:" , content);
    client.canvases.create({
      title: target_id + "'s Channels",
      description: content,
      channel_id: "C09AHN6V1U7",
    });
    console.log ("I got here");
    return { outputs: {} };
  },
);