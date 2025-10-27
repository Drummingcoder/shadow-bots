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
  name: "Sans Tracker",
  description: "Spending a bit too much time on Slack, are we?",
  longDescription: `This bot helps to track your time on Slack and ping you for every 30 minutes you spend on Slack in a day. For every hour you spend off of Slack (minus 7 hours for sleep time), the bot will give you 1 coin (at 12:00am PST). You can use one coin to skip one ping using the '/timetospend' command. To start tracking, simply just mention the bot in a channel that it's in (no other message is needed) and follow the prompts. \n\nThis bot only operates in <#C09GDF8ETQB>, so join it if you want to start tracking your time. \n\nFor more details, go to https://hackclub.slack.com/docs/T0266FRGM/F09JPH7HY82, or just ask questions in <#C09GDF8ETQB>.`,
  icon: "assets/newsans.png",
  workflows: [responder, first, checke, checked, spent, domake, letsmakethe, testremind],
  outgoingDomains: ["hackatime.hackclub.com", "generativelanguage.googleapis.com"],
  datastores: [trackUsers, usertime, minusCoins, remindchecker, theonechecker],
  botScopes: ["pins:write", "users.profile:read", "channels:read", "users:read", "groups:write", "channels:join", "im:read", "im:write", "triggers:read", "triggers:write", "channels:history", "im:history", "groups:history", "mpim:history", "commands", "chat:write", "chat:write.public", "datastore:read", "datastore:write", "app_mentions:read", "groups:read", "channels:manage", "channels:write.invites", "groups:write.invites"],
});
