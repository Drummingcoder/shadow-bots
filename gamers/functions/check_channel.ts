import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const channelCheck = DefineFunction({
  callback_id: "talker_yapper",
  title: "Small Talk",
  description: "Just a couple of fun facts!",
  source_file: "functions/check_channel.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to check",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
      timestamp: {
        type: Schema.types.string,
        description: "Timestamp reply",
      },
    },
    required: ["message", "channel_id", "timestamp"],
  },
});

export default SlackFunction(
  channelCheck,
  async ({ inputs, client }) => {
    const myMessage = `${inputs.message}`;
    if (inputs.message.includes("flip") && inputs.message.includes("coin")) {
      const mess = myMessage.split(" ");
      let num = parseInt(mess[2],10);

      if (!isNaN(num) && isFinite(num)) {
        if (num > 1000000) {
          await client.chat.postMessage({
            channel: inputs.channel_id,
            text: `The limit is 1000000 coins, rolling 1000000 coins instead.`,
            thread_ts: inputs.timestamp,
          });
          num = 1000000;
        }

        let numHeads = 0, numTails = 0;
        let message = "You rolled ";

        for (let i = 0; i < num; i++) {
          if (Math.random() < 0.5) {
            numHeads++;
            message += "heads, ";
          } else {
            numTails++;
            message += "tails, ";
          }
        }

        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: message,
          thread_ts: inputs.timestamp,
        });

        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `That's a total of ${numHeads} heads and ${numTails} tails.`,
          thread_ts: inputs.timestamp,
        });

        return { outputs: {} };
      }

      const coin = Math.random();
      let result = "";
      if (coin < 0.5) {
        result = "heads";
      } else {
        result = "tails";
      }
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: `It's ${result}!`,
        thread_ts: inputs.timestamp,
      });
    } else if (inputs.message.includes("roll") && (inputs.message.includes("dice") || inputs.message.includes("die"))) {
      const mess = myMessage.split(" ");
      let num = parseInt(mess[2],10);
      if (num == 0) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: "You rolled nothing!",
          thread_ts: inputs.timestamp,
        });
        return { outputs: {} };
      }

      if (num > 1000000) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `The limit is 1000000 coins, rolling 1000000 coins instead.`,
          thread_ts: inputs.timestamp,
        });
        num = 1000000;
      }

      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Rolling...",
        thread_ts: inputs.timestamp,
      });
      let str = "You rolled ";
      if (num == 1) {
        const num = Math.floor(Math.random() * (6) + 1);
        str += "a " + num + ".";
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: str,
          thread_ts: inputs.timestamp,
        });
      } else {
        let sum = 0;
        const num1 = Math.floor(Math.random() * (6) + 1);
        str += num1 + ", ";
        sum += num1;
        for (let i = 1; i < (num - 1); i++) {
          const num2 = Math.floor(Math.random() * (6) + 1);
          str += num2 + ", ";
          sum += num2;
        }
        const num3 = Math.floor(Math.random() * (6) + 1);
        str += "and " + num3 + ".";
        sum += num3;
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: str,
          thread_ts: inputs.timestamp,
        });
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: "The sum of all rolled numbers is " + sum + ".",
          thread_ts: inputs.timestamp,
        });
      }
    } else if ((inputs.message.includes("eight") || inputs.message.includes("8")) && inputs.message.includes("ball")) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Shaking the ball...",
        thread_ts: inputs.timestamp,
      });
      let rando = Math.random(); //values from 0 to 0.99
      let reroll = Math.random();
      for (let chances = 0.4; reroll > chances; chances += 0.1) {
        rando = Math.random();
        reroll = Math.random();
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: "Shaking the ball...",
          thread_ts: inputs.timestamp,
        });
      }
      if (rando < 0.4) {
        const responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "As I see it, yes", "Most likely", "Signs point to yes", "Outlook good"];
        const index = Math.floor(Math.random() * (8));
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `The 8-ball says: "${responses[index]}"`,
          thread_ts: inputs.timestamp,
        });
      } else if (rando < 0.7) {
        const responses = ["Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful", "Highly Unlikely"];
        const index = Math.floor(Math.random() * (6));
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `The 8-ball says: "${responses[index]}"`,
          thread_ts: inputs.timestamp,
        });
      } else {
        const responses = ["Reply hazy", "try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again"];
        const index = Math.floor(Math.random() * (6));
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `The 8-ball says: "${responses[index]}"`,
          thread_ts: inputs.timestamp,
        });
      }
    } else if ((inputs.message.includes("kys") || inputs.message.includes("kill yourself")) || (inputs.message.includes("leave"))) {
      await client.conversations.leave({
        channel: inputs.channel_id,
      });
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Leaving the channel... Bye!",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { } };
    } else if (myMessage.includes("fuck") && ((myMessage.includes("u") || myMessage.includes("you")) || myMessage.includes("Dokeshi"))) {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "You wanna do it with me? UwU",
        thread_ts: inputs.timestamp,
      });
    } else if ((myMessage.includes("fun fact") || myMessage.includes("fun facts")) && ((myMessage.includes("u") || myMessage.includes("you")) || myMessage.includes("Dokeshi"))) {
        await client.chat.postMessage({
          channel: inputs.channel_id,
          text: `Dokeshi is 6'7", has 420 friends, has parents that are 41 years old, and touched the hearts of 69 people!`,
          thread_ts: inputs.timestamp,
        });
    } else {
      await client.chat.postMessage({
        channel: inputs.channel_id,
        text: "Sorry, this response isn't supported yet.",
        thread_ts: inputs.timestamp,
      });
      return { outputs: { error: "Can't handle this response" } };
    }
    return { outputs: {} };
  },
);