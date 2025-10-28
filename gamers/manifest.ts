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
import yourDeath from "./datastores/deathkeeper.ts";
import getDeath from "./workflows/getpeople.ts";
import playDeath from "./workflows/airesponse.ts";

export default Manifest({
  name: "Magical Dokeshi",
  description: "Feeling a bit bored?",
  longDescription: "A bot that hosts games for you and your friends to play in Slack!\n\nGames: Use '/playOmniRPS' to play a game of magical Omniscient Rock, Paper, Scissors. After choosing a channel to play in (it can be any public channel as long as the bot is in the channel), you can choose to play alone or play with another friend, but if you play alone, you automatically get lock into Multiple Answers mode. The mode selector determines how the game will run. In the 'One Toss' mode, you get to play one move, just like in a classic game of Rock Paper Scissors! In the Multiple Answers mode, you and your friend (or just yourself) go back and forth, giving answers that will beat the previous response until one of you fails. Magical responses only!\n\nYou can also play magical Death by AI using the '/deathbyai' command. You can play with 1-10 people, simply respond in the thread to join the game! The host (the person who ran the command) can then start the game by responding with 'start' in the thread (don't add anything else). Once the game is started, use the '/deathrespond' command to respond to the magical prompt. Put the game number and channel you're playing in the form, and also put your survival strategy in. Once all players have put their responses in, the bot will announce the results in the channel.\n\nMore details and other features at: https://hackclub.slack.com/docs/T0266FRGM/F09HJ4A4AGN",
  icon: "assets/jester.jpeg",
  workflows: [updater, starting, startOmni, nextMove, startDeath, getDeath, playDeath],
  outgoingDomains: ["ai.hackclub.com", "generativelanguage.googleapis.com"],
  datastores: [game, games, omnigames, multi, myDeath, yourDeath],
  botScopes: [ "channels:manage", "datastore:read", "datastore:write", "channels:read", "channels:history", "emoji:read", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write", "groups:history", "groups:read", "groups:write", "channels:join"],
});
