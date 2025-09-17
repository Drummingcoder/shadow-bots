import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";
import anonReact from "./workflows/anon_emoji.ts";

export default Manifest({
  name: "Jester",
  description: "Are they in this channel?",
  longDescription: "This bot checks to see if a certain person is in a channel. Right now it can't check if a user is in a channel with more than 1000 people yet but I'm working on removing that limit. To use the bot, mention the bot and ask it 'is @user in #channel?' It can be used in any public channel, but it can't check or run in any private channels. \n\nAlso, you can anonymously react to any message with an emoji of your choice. Just use the shortcut '/anon-emoji' and provide the message link and the emoji name (without colons) in the form provided.",
  icon: "assets/jesterhat.png",
  workflows: [exposeChannels, anonReact],
  outgoingDomains: [],
  botScopes: [ "channels:read", "channels:history", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write"],
});
