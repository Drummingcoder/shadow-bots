import { Manifest } from "deno-slack-sdk/mod.ts";
import SampleWorkflow from "./workflows/sample_workflow.ts";
import SampleObjectDatastore from "./datastores/sample_datastore.ts";
import keepgoing from "./workflows/joining.ts";

export default Manifest({
  name: "Monkey",
  description: "Ooh ooh ah ah",
  icon: "assets/monkey.jpg",
  workflows: [SampleWorkflow, keepgoing],
  outgoingDomains: [],
  datastores: [SampleObjectDatastore],
  botScopes: [ "channels:history", "im:history", "groups:history", "mpim:history", "commands", "chat:write", "chat:write.public", "datastore:read", "datastore:write", "app_mentions:read", "channels:read", "groups:read", "im:read", "mpim:read", "channels:join", "channels:manage", "channels:write.invites", "groups:write", "groups:write.invites", "im:write", "mpim:write"],
});
