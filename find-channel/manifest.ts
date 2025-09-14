import { Manifest } from "deno-slack-sdk/mod.ts";
import exposeChannels from "./workflows/message.ts";
import exposeChannels1 from "./workflows/user_re.ts";

export default Manifest({
  name: "Jester",
  description: "What channels are they in?",
  icon: "assets/default_new_app_icon.png",
  workflows: [exposeChannels, exposeChannels1],
  outgoingDomains: [],
  botScopes: [ "commands", "canvases:read", "canvases:write", "chat:write", "chat:write.public", "channels:read", "app_mentions:read", "users:read"],
});
