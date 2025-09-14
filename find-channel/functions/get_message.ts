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
        const response = await client.conversations.list({
            types: "public_channel",
            limit: 100,
            cursor: cursor,
        });

        if (response.ok) {
          console.log(response);
        }

        if (!response.ok || !Array.isArray(response.channels)) {
            console.log("End of channel list:", response);
        }

        let calls = 0;
        for (const channel of response.channels) {
          console.log("before puase");
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log("after puase ", calls);
          const place = await client.conversations.members({
            channel: channel.id,
            cursor: cursor,
          });
          calls++;
          if (place.members && place.members.includes(target_id)) {
            console.log("channel:", channel.name);
            result.push(channel.name);
          }
        }

    let content = "List of channels <@" + target_id + "> is in:\n\n";

    console.log("target_id:", target_id);
    console.log("result array:", result);
    console.log("result length:", result.length);

    for (const channel of result) {
      content += `#${channel}\n\n`;
    }
    console.log ("content:" , content);
    
    const re = await client.canvases.create({
      title: target_id + "'s Channels",
      document_content: {"type": "markdown", "markdown": `${content}`},
      channel_id: "C09AHN6V1U7",
      owner_id: "U091EPSQ3E3",
    });
    console.log("Canvas created successfully", re);
    
    return { outputs: {} };
  },
);