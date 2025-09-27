import { Manifest } from "deno-slack-sdk/mod.ts";
import updater from "./workflows/message.ts";
import starting from "./workflows/start_game.ts";
import game from "./datastores/tracker.ts";
import games from "./datastores/gametrack.ts";

export default Manifest({
  name: "The Dokeshi",
  description: "Feeling a bit bored?",
  longDescription: "This is a work in progress! A bot that hosts games for you and your friends to play in Slack. I'm starting with a rock-paper-scissors game, but I have plans for more! And just to reiterate, this is a work in progress (WIP)!",
  icon: "assets/jester.jpeg",
  workflows: [updater, starting],
  outgoingDomains: [],
  datastores: [game, games],
  botScopes: [ "channels:manage", "datastore:read", "datastore:write", "channels:read", "channels:history", "emoji:read", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write", "groups:history", "groups:read", "groups:write", "channels:join"],
});
