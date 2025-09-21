import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";
import anonReact from "./workflows/anon_emoji.ts";
import annoyReacter from "./workflows/annoy.ts";
import annoy from "./workflows/annoy_go.ts";
import emojiuser from "./datastores/emoji.ts";

export default Manifest({
  name: "Jester",
  description: "A grab bag of tricks! Channel checking, anonymous reactions, and more to come!",
  longDescription: "You can anonymously react to any message with an emoji of your choice! Just use the shortcut '/anon-emoji' and provide the message link and the emoji name (without colons) in the form provided. It works in any private or public channel, even if it's not in the channel!. You can also remove a reaction made with Jester by reacting with the same emoji on the same message, which does mean only one person can react to the message with the same emoji (meaning that if one person reacts to a message with :loll:  and another person reacts with :loll: on that message, the reaction will be removed). I may come back to fix this at a later time...\n\nYou can also react to all new messages of a certain person using the '/annoy-emoji' command, which means that if you put something like :grass: on a person like @grass, all new messages that grass sends will be reacted to with :grass:. This only works if the bot is in the channel (public or private). All you need to do is enter the user and the emoji into the form that shows up! To remove the auto-react, simply type reenter the form and choose the same person and emoji. If you choose a different emoji, the auto-react will simply be updated with the new reaction.\n\nFor more information go to: https://hackclub.slack.com/docs/T0266FRGM/F09G5J78TJ7",
  icon: "assets/jesterhat.png",
  workflows: [exposeChannels, anonReact, annoyReacter, annoy],
  datastores: [emojiuser],
  outgoingDomains: [],
  botScopes: [ "datastore:read", "datastore:write", "channels:read", "channels:history", "emoji:read", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write", "groups:history", "groups:read", "groups:write", "channels:join"],
});
