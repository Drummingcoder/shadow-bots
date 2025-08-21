import { Manifest } from "deno-slack-sdk/mod.ts";
import { ImageWelcomer } from "./functions/get_image.ts";
import { WelcomeMessage } from "./functions/message.ts";
import { ShadowHello } from "./workflows/welcome.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Shadow Hello",
  description: "Warmly welcome a new member",
  icon: "assets/deku.jpeg",
  functions: [],
  workflows: [ShadowHello],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
