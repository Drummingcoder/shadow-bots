import { Manifest } from "deno-slack-sdk/mod.ts";
import updater from "./workflows/message.ts";
import starting from "./workflows/start_game.ts";
import game from "./datastores/tracker.ts";
import games from "./datastores/gametrack.ts";
import omnigames from "./datastores/omnigametrack.ts";
import startOmni from "./workflows/startOmniGame.ts"
import multi from "./datastores/multigame.ts";
import nextMove from "./workflows/moveon.ts";
import startDeath from "./workflows/deathby.ts";
import myDeath from "./datastores/deathtracker.ts";
import getDeath from "./workflows/getpeople.ts";

export default Manifest({
  name: "Magical Dokeshi",
  description: "Feeling a bit bored?",
  longDescription: "A bot that hosts games for you and your friends to play in Slack. I'm starting with a rock-paper-scissors game, but I have plans for more!\n\nUse the command `/playOmniRPS` to get started. At the current moment, it's a simple game of rock, paper, scissors. Choose a partner to play with, and a channel to play in! Use the buttons in the reply to the start message to make your move. Have fun!\n\nMore details and other features at: https://hackclub.slack.com/docs/T0266FRGM/F09HJ4A4AGN",
  icon: "assets/jester.jpeg",
  workflows: [updater, starting, startOmni, nextMove, startDeath, getDeath],
  outgoingDomains: ["ai.hackclub.com"],
  datastores: [game, games, omnigames, multi, myDeath],
  botScopes: [ "channels:manage", "datastore:read", "datastore:write", "channels:read", "channels:history", "emoji:read", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write", "groups:history", "groups:read", "groups:write", "channels:join"],
});
