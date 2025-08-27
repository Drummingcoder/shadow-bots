import { Manifest } from "deno-slack-sdk/mod.ts";
import { getImage } from "./functions/get_image_function.ts";
import { welcomeMessage } from "./functions/message.ts";
import { blockMessage } from "./functions/block.ts";
import { ShadowHello } from "./workflows/welcome.ts";

export default Manifest({
  name: "Shadow Hello",
  description: "Warmly welcome a new member",
  icon: "assets/deku.jpeg",
  functions: [getImage, welcomeMessage, blockMessage],
  workflows: [ShadowHello],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
