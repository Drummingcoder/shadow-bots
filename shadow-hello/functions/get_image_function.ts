import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

export const getImage = DefineFunction({
    callback_id: "get_image_function",
    title: "Get Image",
    source_file: "functions/get_image_function.ts",
    input_parameters: {
      properties: {
        new_member: { type: Schema.slack.types.user_id },
        interactivity: { type: Schema.slack.types.interactivity },
      },
    required: ["new_member", "interactivity"],
  },
  output_parameters: {
    properties: {
      image_url: { type: Schema.types.string },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["image_url", "interactivity"],
  },
});

export default SlackFunction(
  getImage,
  async ({ inputs, client }) => {
    const { new_member } = inputs;
    const userInfo = await client.users.info({ user: new_member });
    let userProfile;

    if (userInfo.ok && userInfo.user) {
      const user = userInfo.user;
      userProfile = {
        profile_pic_url: user.profile.image_72 || user.profile.image_48,
        display_name: user.profile.display_name || user.profile.real_name || user.name,
        real_name: user.profile.real_name,
      };
    }

    try {
      const githubToken = Deno.env.get("GITHUB_TOKEN");
      if (githubToken) {
        const image = new Image(580, 580);

        const background = await Image.decode(await Deno.readFile("./assets/anime-club.png"));

        image.composite(background, 0, 195);

        if (userProfile?.profile_pic_url) {
          const response = await fetch(userProfile?.profile_pic_url);
          if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const profileImage = await Image.decode(uint8Array);

          image.composite(profileImage, 400, 400);
        }
        const imageData = await image.encode();
        const image_url = await uploadToGithubRepo(imageData, `welcome_${new_member}.png`);
        return { outputs: { image_url, interactivity: inputs.interactivity } };
      }
    } catch (error) {
      console.error("Failed to generate/upload image:", error);
    }
    
    const image_url = "https://img.freepik.com/free-vector/stylish-welcome-lettering-banner-join-with-joy-happiness_1017-57675.jpg?semt=ais_hybrid&w=740&q=80";
    return { outputs: { image_url, interactivity: inputs.interactivity } };
  },
);

async function uploadToGithubRepo(imageData: Uint8Array, filename: string): Promise<string> {
  const githubToken = Deno.env.get("GITHUB_TOKEN");
  const owner = "Drummingcoder";
  const repo = "slack-images";
  const path = `slack/${filename}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const fileResponse = await fetch(apiUrl, {
      method: 'HEAD',
      headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
      },
  });

  if (fileResponse.ok) {
      return `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  }
  
  let binaryString = '';
  for (let i = 0; i < imageData.length; i++) {
    binaryString += String.fromCharCode(imageData[i]);
  }
  const content = btoa(binaryString);

  const apiData = {
    message: `Upload image for Slack: ${filename}`,
    content: content,
    branch: "main"
  };

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiData),
  });

  if (!response.ok) {
    throw new Error(`GitHub upload failed: ${response.statusText}`);
  }

  const _result = await response.json();
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  
  return rawUrl;
}