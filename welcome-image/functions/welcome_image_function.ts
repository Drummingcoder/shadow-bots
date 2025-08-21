import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { createCanvas, loadImage } from "jsr:@josefabio/deno-canvas@1.5.2";
import { Base64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
/**
 * This custom function generates a welcome image for a specified user.
 */
export const WelcomeImageFunction = DefineFunction({
  callback_id: "welcome_image_function",
  title: "Image Welcomer",
  description: "Fetches user info and creates a personalized welcome image.",
  source_file: "welcome_image_function.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The ID of the user to welcome.",
      },
    },
    required: ["user_id"],
  },
  output_parameters: {
    properties: {
      image_data: {
        type: Schema.types.string,
        description: "The Base64 encoded welcome image data.",
      },
    },
    required: ["image_data"],
  },
});

export default SlackFunction(
  WelcomeImageFunction,
  async ({ inputs, client }) => {
    try {
      const userResponse = await client.users.info({
        user: inputs.user_id,
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to get user info: ${userResponse.error}`);
      }

      const user = userResponse.user;
      const userName = user?.real_name || user?.name || "New User";
      const profilePicUrl = user?.profile?.image_512;

      if (!profilePicUrl) {
        throw new Error("User profile picture not found.");
      }

      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext("2d");

      // Draw a simple background
      ctx.fillStyle = "#333333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a welcome message
      ctx.font = "bold 60px 'Times New Roman'";
      ctx.fillStyle = "#F5F5F5";
      ctx.textAlign = "center";
      ctx.fillText("Welcome!", canvas.width / 2, 100);

      // Draw the user's name
      ctx.font = "40px 'Times New Roman'";
      ctx.fillText(userName, canvas.width / 2, 160);

      // Load and draw the user's profile picture
      const profileImage = await loadImage(profilePicUrl);
      const imageSize = 200;
      const imageX = (canvas.width / 2) - (imageSize / 2);
      const imageY = 180;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(profileImage, imageX, imageY, imageSize, imageSize);
      ctx.restore();

      // Get the image data as a Base64 string
      const imageData = canvas.toDataURL("image/png");

      return {
        outputs: {
          image_data: imageData,
        },
      };
    } catch (error) {
      console.error("Error generating welcome image:", error);
      return {
        error: "Failed to generate welcome image.",
      };
    }
  },
);