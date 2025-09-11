import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";

export default Manifest({
  name: "Jester",
  description: "What channels are they in?",
  icon: "assets/default_new_app_icon.png",
  workflows: [exposeChannels],
  outgoingDomains: [],
  botScopes: [ "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "channels:read", "app_mentions:read", "users:read"],
});
