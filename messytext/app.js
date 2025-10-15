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

  const backarr = {"a": "ɒ", "b": "d", "c": "ɔ", "d": "b", "e": "ɘ", "f": "ʇ", "g": "ϱ", "h": "⑁", "i": "i", "j": "ᒑ", "k": "ʞ", "l": "l", "m": "m", "n": "n", "o": "o", "p": "q", "q": "p", "r": "ɿ", "s": "ƨ", "t": "ɟ", "u": "u", "v": "v", "w": "w", "x": "x", "y": "γ", "z": "z", 
        "A": "A", "B": "ᗺ", "C": "Ɔ", "D": "ꓷ", "E": "Ǝ", "F": "ꟻ", "G": "ວ", "H": "H", "I": "I", "J": "ᒐ", "K": "ꓘ", "L": "⅃", "M": "M", "N": "И", "O": "O", "P": "ᑫ", "Q": "Ϙ", "R": "Я", "S": "Ƨ", "T": "T"};
  const downarr = {"a": "ɐ", "b": "q", "c": "ɔ", "d": "p", "e": "ǝ", "f": "ɟ", "g": "ƃ", "h": "ɥ", "i": "ı̣", "j": "ɾ̣", "k": "ʞ", "l": "ן", "m": "ɯ", "n": "u", "o": "o", "p": "d", "q": "b", "r": "ɹ", "s": "s", "t": "ʇ", "u": "n", "v": "ʌ", "w": "ʍ", "x": "x", "y": "ʎ", "z": "z", 
        "A": "Ɐ", "B": "ꓭ", "C": "Ɔ", "D": "ꓷ", "E": "Ǝ", "F": "Ⅎ", "G": "ꓨ", "H": "H", "I": "I", "J": "ſ", "K": "ꓘ", "L": "ꓶ", "M": "W", "N": "N", "O": "O", "P": "Ԁ", "Q": "Ꝺ", "R": "ꓤ", "S": "S", "T": "ꓕ", "U": "ꓵ", "V": "ꓥ", "W": "M", "X": "X", "Y": "⅄", "Z": "Z"};
  let text = "";

  if (Math.random() < 0.35) {
    const random = Math.random()
    if (random < 0.3333) {
      for (let j = userText.length - 1; j >= 0; j--) {
        text += userText[j];
      }
    } else if (random < 0.6666) {
      if (Math.random() < 0.5) {
        for (let j = userText.length - 1; j >= 0; j--) {
          text += backarr[userText[j]] || userText[j];
        }
      } else {
        for (let j = 0; j < userText.length; j++) {
          text += backarr[userText[j]] || userText[j];
        }
      }
    } else {
      if (Math.random() < 0.5) {
        for (let j = userText.length - 1; j >= 0; j--) {
          text += downarr[userText[j]] || userText[j];
        }
      } else {
        for (let j = 0; j < userText.length; j++) {
          text += downarr[userText[j]] || userText[j];
        }
      }
    }
  } else {
    if (Math.random() < 0.5) {
      for (let j = userText.length - 1; j >= 0; j--) {
        const rand1 = Math.random();
        if (rand1 < 0.33333) {
          text += downarr[userText[j]] || userText[j];
        } else if (rand1 < 0.66666) {
          text += backarr[userText[j]] || userText[j];
        } else {
          text += userText[j];
        }
      }
    } else {
      for (let j = 0; j < userText.length; j++) {
        const rand1 = Math.random();
        if (rand1 < 0.33333) {
          text += downarr[userText[j]] || userText[j];
        } else if (rand1 < 0.66666) {
          text += backarr[userText[j]] || userText[j];
        } else {
          text += userText[j];
        }
      }
    }
  }

  if (Math.random() < 0.6) {
    const words = text.split(' ');
    const temptext = text;
    text = words.map(word => {
      const rand2 = Math.random();
      if (rand2 < 0.25) {
        return ("*" + word + "*");
      } else if (rand2 < 0.5) {
        return ("_" + word + "_");
      } else if (rand2 < 0.75) {
        return ("~" + word + "~");
      } else {
        return word;
      }
    }).join(' ');
  }

  await client.chat.postMessage({
    channel: channel,
    text: text,
    username: displayname,
    icon_url: display.profile.image_512,
  });
});

app.command('/translatetons', async ({ ack, say, client, command}) => {
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

  let text = userText;
  let sourceLang = "en", targetLang = "";
  const listoflang = [
  "aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av",
  "ay", "az", "ba", "be", "bg", "bi", "bm", "bn", "bo", "br",
  "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy",
  "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et",
  "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd",
  "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht",
  "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io",
  "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk",
  "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky",
  "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg",
  "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na",
  "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny",
  "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt",
  "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se",
  "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss",
  "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk",
  "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk",
  "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo",
  "za", "zh", "zu"];

  for (let i = 0; i < 5; i++) {
    let response = await fetch(`https://translate.flossboxin.org.in/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          q: text,          
          source: sourceLang,
          target: targetLang,
          format: 'text',
          api_key: '',
      }),
    });
    const data = await response.json();
    const rep = data.translatedText;
    text = rep;
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
