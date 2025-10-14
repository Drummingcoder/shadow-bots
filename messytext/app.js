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
  const username = command.user_id;

  const display = await client.users.profile.get({
    user: username,
  });

  let displayname = display.profile.display_name;
  if (displayname == "") {
    displayname = display.profile.real_name;
  }

  let text = "";
  const random = Math.random()
  if (random < 0.3333) {
    for (let j = userText.length - 1; j >= 0; j--) {
      text += userText[j];
    }
  } else if (random < 0.6666) {
    const arr = {"a": "ɒ", "b": "d", "c": "ɔ", "d": "b", "e": "ɘ", "f": "ʇ", "g": "ϱ", "h": "⑁", "i": "i", "j": "ᒑ", "k": "ʞ", "l": "l", "m": "m", "n": "n", "o": "o", "p": "q", "q": "p", "r": "ɿ", "s": "ƨ", "t": "ɟ", "u": "u", "v": "v", "w": "w", "x": "x", "y": "γ", "z": "z", 
      "A": "A", "B": "ᗺ", "C": "Ɔ", "D": "ꓷ", "E": "Ǝ", "F": "ꟻ", "G": "ວ", "H": "H", "I": "I", "J": "ᒐ", "K": "ꓘ", "L": "⅃", "M": "M", "N": "И", "O": "O", "P": "ᑫ", "Q": "Ϙ", "R": "Я", "S": "Ƨ", "T": "T"};
    if (Math.random() < 0.5) {
      for (let j = userText.length - 1; j >= 0; j--) {
        text += arr[userText[j]] || userText[j];
      }
    } else {
      for (let j = 0; j < userText.length; j++) {
        text += arr[userText[j]] || userText[j];
      }
    }
  } else {
    const arr = {"a": "ɐ", "b": "q", "c": "ɔ", "d": "p", "e": "ǝ", "f": "ɟ", "g": "ƃ", "h": "ɥ", "i": "ı̣", "j": "ɾ̣", "k": "ʞ", "l": "ן", "m": "ɯ", "n": "u", "o": "o", "p": "d", "q": "b", "r": "ɹ", "s": "s", "t": "ʇ", "u": "n", "v": "ʌ", "w": "ʍ", "x": "x", "y": "ʎ", "z": "z", 
      "A": "Ɐ", "B": "ꓭ", "C": "Ɔ", "D": "ꓷ", "E": "Ǝ", "F": "Ⅎ", "G": "ꓨ", "H": "H", "I": "I", "J": "ſ", "K": "ꓘ", "L": "ꓶ", "M": "W", "N": "N", "O": "O", "P": "Ԁ", "Q": "Ꝺ", "R": "ꓤ", "S": "S", "T": "ꓕ", "U": "ꓵ", "V": "ꓥ", "W": "M", "X": "X", "Y": "⅄", "Z": "Z"};
    if (Math.random() < 0.5) {
      for (let j = userText.length - 1; j >= 0; j--) {
        text += arr[userText[j]] || userText[j];
      }
    } else {
      for (let j = 0; j < userText.length; j++) {
        text += arr[userText[j]] || userText[j];
      }
    }
  }

  await client.chat.postMessage({
    channel: channel,
    text: text,
    username: displayname,
    icon_url: display.profile.image_512,
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('The messytext app is running! Please migrate to Jester soon');
})();
