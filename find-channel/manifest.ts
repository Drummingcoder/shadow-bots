import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";

export default Manifest({
  name: "Jester",
  description: "Are they in this channel?",
  longDescription: "This bot checks to see if a certain person is in a channel. Right now it can't check if a user is in a channel with more than 1000 people yet but I'm working on removing that limit. To use the bot, mention the bot and ask it 'is @user in #channel?' It can only be used in #darklight-idea and #siege atm, but it can work in your channel if you DM me (so that I can let it run in your channel), but it can't check or run in any private channels.",
  icon: "assets/jesterhat.png",
  workflows: [exposeChannels],
  outgoingDomains: [],
  botScopes: [ "channels:read", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write"],
});
