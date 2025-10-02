import { Manifest } from "deno-slack-sdk/mod.ts";
import SampleWorkflow from "./workflows/sample_workflow.ts";

export default Manifest({
  name: "sans-triggered",
  description: "To make sure Sans runs every 30 secs",
  icon: "assets/default_new_app_icon.png",
  workflows: [SampleWorkflow],
  outgoingDomains: [],
  datastores: [],
  botScopes: ["users.profile:read", "datastore:read","datastore:write", "channels:read", "channels:history", "commands", "chat:write", "chat:write.public", "app_mentions:read", "users:read", "groups:history", "groups:read", "groups:write", "channels:join", "im:read", "im:write"],
});
