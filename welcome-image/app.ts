import { SlackApp } from "https://deno.land/x/slack_sdk@2.3.0/mod.ts";
import manifest from "./manifest.ts";

/**
 * The app entry point that registers the app's manifest.
 * This is the file you run with `slack deploy`.
 */
export const app = new SlackApp({
  manifest,
});