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

        const background = await fetch("https://raw.githubusercontent.com/Drummingcoder/slack-images/main/assets/anime-club.png");
        const backgroundArrayBuffer = await background.arrayBuffer();
        const backgroundUint8Array = new Uint8Array(backgroundArrayBuffer);
        const backgroundImage = await Image.decode(backgroundUint8Array);

        image.composite(backgroundImage, 0, 97.5);

        if (userProfile?.profile_pic_url) {
          const response = await fetch(userProfile?.profile_pic_url);
          if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const profileImage = await Image.decode(uint8Array);

          image.composite(profileImage, 275, 375);
          const font = "https://raw.githubusercontent.com/Drummingcoder/slack-images/main/fonts/Coolvetica%20Rg.otf";
          const fontFetch = await fetch(font);
          const fData = new Uint8Array(await fontFetch.arrayBuffer());
          image.composite(await Image.renderText(fData, 70, `Yo ${userInfo.user.profile.real_name}!`, 0x000000FF), 45, 0);
          image.composite(await Image.renderText(fData, 48, `Welcome to the gang!`, 0x000000FF), 50, 480);
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
  
  let fileSha: string | undefined;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  try {
    const fileResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });

    if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        fileSha = fileData.sha;
        console.log("📁 File exists, will update with SHA:", fileSha);
    }
  } catch (error) {
    console.log("📝 File doesn't exist, creating new");
  }
  
  let binaryString = '';
  for (let i = 0; i < imageData.length; i++) {
    binaryString += String.fromCharCode(imageData[i]);
  }
  const content = btoa(binaryString);

  const apiData: any = {
    message: `Upload image for Slack: ${filename}`,
    content: content,
    branch: "main"
  };
  
  if (fileSha) {
    apiData.sha = fileSha;
  }

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
    const errorText = await response.text();
    throw new Error(`GitHub upload failed: ${response.status} - ${errorText}`);
  }

  const _result = await response.json();
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  
  return `${rawUrl}?t=${Date.now()}`;
}