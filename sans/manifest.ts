import { Manifest } from "deno-slack-sdk/mod.ts";
import responder from "./workflows/dmflow.ts";
import trackUsers from "./datastores/users.ts";
import first from "./workflows/onboarding.ts";
import usertime from "./datastores/timeusers.ts";
import checke from "./workflows/pingandcheck.ts";
import checked from "./workflows/coincounter.ts";
import spent from "./workflows/spender.ts";
import minusCoins from "./datastores/coinusers.ts";

export default Manifest({
  name: "Sans Tracker",
  description: "Spending a bit too much time on Slack, are we?",
  icon: "assets/sans.jpg",
  workflows: [responder, first, checke, checked, spent],
  outgoingDomains: [],
  datastores: [trackUsers, usertime, minusCoins],
  botScopes: ["users.profile:read", "datastore:read","datastore:write", "channels:read", "channels:history", "commands", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "groups:history", "groups:read", "groups:write", "channels:join", "im:read", "im:write"],
});
