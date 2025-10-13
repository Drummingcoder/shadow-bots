const { App } = require('@slack/bolt');

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

app.command('/messytext', async ({ ack, say, client, command}) => {
  await ack();
  const userText = command.text;
  const channel = command.channel_id;
  const username = command.user_name;

  await client.chat.postMessage({
    channel: channel,
    text: userText,
    username: username,
  });
  await respond(`${command.text}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('The messytext app is running!');
})();
