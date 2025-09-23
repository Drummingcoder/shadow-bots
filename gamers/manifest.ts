import { Manifest } from "deno-slack-sdk/mod.ts";


export default Manifest({
  name: "The Dokeshi",
  description: "Feeling a bit bored?",
  longDescription: "This is a work in progress!",
  icon: "assets/jester.png",
  workflows: [],
  outgoingDomains: [],
  datastores: [],
  botScopes: [ "channels:manage", "datastore:read", "datastore:write", "channels:read", "channels:history", "emoji:read", "reactions:write", "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "triggers:read", "triggers:write", "groups:history", "groups:read", "groups:write", "channels:join"],
});
