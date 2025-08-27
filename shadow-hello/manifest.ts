import { Manifest } from "deno-slack-sdk/mod.ts";
import { getImage } from "./functions/get_image_function.ts";
import { welcomeMessage } from "./functions/message.ts";
import { blockMessage } from "./functions/block.ts";
import { ShadowHello } from "./workflows/welcome.ts";
import { pingMe } from "./functions/ping_me.ts";
import { PingResponse } from "./workflows/pingflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Shadow Hello",
  description: "Warmly welcome a new member",
  icon: "assets/deku.jpeg",
  functions: [getImage, welcomeMessage, blockMessage, pingMe],
  workflows: [ShadowHello, PingResponse],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
