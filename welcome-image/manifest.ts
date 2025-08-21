import { Manifest } from "deno-slack-sdk/mod.ts";
import { WelcomeImageFunction } from "./functions/welcome_image_function.ts";

/**
 * The app manifest contains the app's configuration,
 * including its name, description, and the functions it contains.
 * For more info: https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Image Welcomer",
  description:
    "An app that generates and sends a personalized welcome image to a channel.",
  icon: "assets/default_new_app_icon.png",
  functions: {
    welcomeImageFunction: WelcomeImageFunction,
  },
  outgoingDomains: [],
  botScopes: ["chat:write", "chat:write.public"],
});