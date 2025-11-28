import { Manifest } from "deno-slack-sdk/mod.ts";
import responder from "./workflows/dmflow.ts";
import trackUsers from "./datastores/users.ts";
import first from "./workflows/onboarding.ts";
import usertime from "./datastores/timeusers.ts";
import checke from "./workflows/pingandcheck.ts";
import checked from "./workflows/coincounter.ts";
import spent from "./workflows/spender.ts";
import minusCoins from "./datastores/coinusers.ts";
import remindchecker from "./datastores/havereminder.ts";
import domake from "./workflows/createreminder.ts";
import letsmakethe from "./workflows/runreminder.ts";
import testremind from "./workflows/testreminder.ts";
import theonechecker from "./datastores/response.ts";

export default Manifest({
  name: "Winter Sans",
  description: "Time tracking and daily reminders in winter season!",
  longDescription: `Send a reminder complete with the amount of time you spend on Slack and the amount of time you spent on Hackatime. Simply use the '/createdaily' command in any channel and fill in the form. You will get a confirmation message in the channel that you send it to. From the start time, the bot will send a summary of your activity as well as comments related to the time you spent on Slack and Hackatime that fits the winter season. You can then reply in the thread with details about your day. If you start the reply with "Day ##:" (replace ## with any number), the bot will pin the parent message to the channel. If not, it will not pin the thread. Regardless of how you start your message, the bot will respond with more comments. The bot needs to be in the channel that you are going to send the reminder to in order for it to work. You also need to be registered with the Sans time tracking feature as well. \n\nThe time tracking part of the bot only operates in <#C09GDF8ETQB>, so join it if you want to start tracking your time. \n\nFor more details, go to https://hackclub.slack.com/docs/T0266FRGM/F09JPH7HY82, or just ask questions in <#C09GDF8ETQB>.`,
  icon: "assets/wintersans.jpg",
  workflows: [responder, first, checke, checked, spent, domake, letsmakethe, testremind],
  outgoingDomains: ["hackatime.hackclub.com", "api.cloudflare.com"],
  datastores: [trackUsers, usertime, minusCoins, remindchecker, theonechecker],
  botScopes: ["pins:write", "users.profile:read", "channels:read", "users:read", "groups:write", "channels:join", "im:read", "im:write", "triggers:read", "triggers:write", "channels:history", "im:history", "groups:history", "mpim:history", "commands", "chat:write", "chat:write.public", "datastore:read", "datastore:write", "app_mentions:read", "groups:read", "channels:manage", "channels:write.invites", "groups:write.invites"],
});
