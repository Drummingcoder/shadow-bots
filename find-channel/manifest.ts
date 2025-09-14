import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";
import exposeChannels1 from "./workflows/user_re.ts";

export default Manifest({
  name: "Jester",
  description: "Are they in this channel?",
  longDescription: "This bot checks to see if a certain person is in a channel. Right now it can't check if a user is in a channel with more than 1000 people yet but I'm working on removing that limit. To use the bot, mention the bot and ask it 'is @user in #channel?' It can be used in any public channel, but it can't check or run in any private channels.",
  icon: "assets/jesterhat.png",
  workflows: [exposeChannels, exposeChannels1],
  outgoingDomains: [],
  botScopes: [ "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "channels:read", "app_mentions:read", "users:read"],
});
