const { App } = require('@slack/bolt');
const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'messytext.db'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    user_hash TEXT PRIMARY KEY,
    person_talking_to TEXT,
    thread TEXT,
    mythread TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS target (
    thisthread TEXT PRIMARY KEY,
    thread TEXT,
    channel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});
const ai = new GoogleGenAI({ apiKey: "AIzaSyC2rmBwJs0hu288h3IEOtsEyXAMGY_An1o" });

app.command('/messytext', async ({ ack, body, client, command}) => {
  await ack();
  const userText = body.text;
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

  if (Math.random() < 0.666) {
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
    thread_ts: command.thread_ts,
    icon_url: display.profile.image_512,
  });
});

app.command('/messyai', async ({ ack, client, command}) => {
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Here is some text, please make it funny by reversing the meaning, changing words around, or make it completely funny and unrelated! Make sure it's random and no extra punctuation, but vary the length of the response! Here's the text to change: "${text}"`,
  });
  console.log("Here's the object", response);
  text = response.text;

  await client.chat.postMessage({
    channel: channel,
    text: text,
    username: displayname,
    icon_url: display.profile.image_512,
  });
});

app.command('/whispertext', async ({ ack, body, client, command}) => {
  await ack();
  const mytext = body.text;
  console.log("Text: ", body.text);
  const channel = command.channel_id;
  const username = command.user_id;

  const arr = mytext.split("> ");
  const usertosend = arr[0].split("|")[0].split("@")[1];
  const userText = arr[1];

  const display = await client.users.profile.get({
    user: username,
  });

  let displayname = display.profile.display_name;
  if (displayname == "") {
    displayname = display.profile.real_name;
  }

  await client.chat.postEphemeral({
    channel: channel,
    text: userText,
    user: usertosend,
    username: displayname,
    icon_url: display.profile.image_512,
  });
});

app.event('app_mention', async ({ event, client }) => {
  await client.chat.postMessage({
    channel: event.channel,
    text: "Checking...",
    thread_ts: event.ts,
  });
  if ((event.text.includes("kys") || event.text.includes("kill yourself")) || (event.text.includes("leave"))) {
    await client.conversations.leave({
      channel: event.channel,
    });
    await client.chat.postMessage({
      channel: event.channel,
      text: "I have left the channel. If you want me to rejoin, please invite me again!",
      thread_ts: event.ts,
    });
    return;
  }

  const myMessage = `${event.text}`;
  let cursor = "";
  let realID = true;
  const matches = myMessage.match(/<([^>]+)>/g);
  console.log("getID:" , matches);
  let target_id = "";
  const userMatch = myMessage.match(/user:(\w+)/);
  console.log("userID:" , userMatch);
  if (matches && matches.length > 2) {
    target_id = matches[1]?.replace("<@", "").replace(">", "");
  } else if ((matches && matches.length == 2) && (userMatch && userMatch.length >= 1)) {
    target_id = userMatch[1];
    realID = false;
  } else {
    if (myMessage.includes("fuck") && ((myMessage.includes("u") || myMessage.includes("you")) || myMessage.includes("Jester"))) {
      await client.chat.postMessage({
        channel: event.channel,
        text: "You wanna do it with me? UwU",
        thread_ts: event.ts,
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: "Sorry, this response isn't supported yet. This is still a work in progress!",
        thread_ts: event.ts,
      });
    }
    return;
  }

  if (target_id) {
    console.log("target:" , target_id);
  }
  let channel = [""];
  if (realID) {
    channel = matches[2]?.split("|");
  } else {
    channel = matches[1]?.split("|");
  }
  console.log("channel:" , channel);
  const theChannel = channel[0].replace("<#", "");

  let place = await client.conversations.members({
    channel: theChannel,
    cursor: cursor,
  });

  let result = false;
  if (realID) {
    if (place.members && place.members.includes(target_id)) {
      result = true;
    }
  } else {
    if (place.members) {
      for (const member of place.members) {
        const userInfo = await client.users.info({ user: member });
        if (userInfo.ok && (userInfo.user?.profile.real_name.toLowerCase() === target_id.toLowerCase() || userInfo.user?.profile.display_name.toLowerCase() === target_id.toLowerCase())) {
          result = true;
          break;
        }
        console.log("user:", userInfo);
      }
    }
  }
  
  do {
    if (place.response_metadata?.next_cursor) {
      cursor = place.response_metadata.next_cursor;
      place = await client.conversations.members({
        channel: theChannel,
        cursor: cursor,
      });
    }
    if (realID) {
      if (place.members && place.members.includes(target_id)) {
        result = true;
      }
    } else {
      if (place.members) {
        for (const member of place.members) {
          const userInfo = await client.users.info({ user: member });
          if (userInfo.ok && userInfo.user?.name.toLowerCase() === target_id.toLowerCase()) {
            result = true;
            break;
          }
        }
      }
    }
  } while (place?.response_metadata?.next_cursor);

  if (result) {
    if (realID) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `Yes, <@${target_id}> is in <#${theChannel}>`,
        thread_ts: event.ts,
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: `Yes, ${target_id} is in <#${theChannel}>`,
        thread_ts: event.ts,
      });
    }
  } else {
    if (realID) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `No, <@${target_id}> is not in <#${theChannel}>`,
        thread_ts: event.ts,
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: `No, ${target_id} is not in <#${theChannel}>`,
        thread_ts: event.ts,
      });
    }
  }
});

app.event('message', async ({ event, client }) => {
  if (event.channel_type !== 'im' || event.bot_id) {
    return;
  }

  let user_id = event.user;
  let go = true;

  if (event.thread_ts) {
    const display = await client.users.profile.get({
      user: user_id,
    });

    let displayname = display.profile.display_name;
    if (displayname == "") {
      displayname = display.profile.real_name;
    }

    await new Promise((resolve, reject) => {
      db.get('SELECT * FROM target WHERE thisthread = ?', [event.thread_ts], (err, row) => {
        if (err) reject(err);
        if (row && row.thread) {
          go = false;
          client.chat.postMessage({
            channel: row.channel,
            text: `${event.text}`,
            thread_ts: row.thread,
            username: displayname,
            icon_url: display.profile.image_512,
          });
        }
        resolve();
      });
    });
  }

  const salt = 'mommyfire';
  const saltedhash = crypto.createHash('sha256').update(user_id + salt).digest('hex');
  
  if (/^<@U\w+>$/.test(event.text) == true && !event.thread_ts) {
    const user_talking = event.text.split(">")[0].split("|")[0].split("@")[1];
    if (user_talking !== "U091EPSQ3E3") {
      await client.chat.postMessage({
        channel: event.channel,
        text: `Sorry, you can only use this to talk to Shadowlight for now. I'll work on adding predetermined messages for anyone later!`,
      });
      return;
    }

    const dmChannel = await client.conversations.open({
      users: user_talking,
    });

    const username = saltedhash.substring(0,10);
    const firstmes = await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: `Someone wants to talk to you!`,
      username: username,
    });

    const targetUserId = event.text;
    db.run('INSERT OR REPLACE INTO messages (user_hash, person_talking_to, thread, mythread) VALUES (?, ?, ?, ?)',
    [saltedhash, targetUserId, firstmes.ts, event.ts], (err) => {
      if (err) {
        console.error('Error:', err);
        client.chat.postMessage({
          channel: event.channel,
          text: `Error connecting to that person. Please try again.`,
        });
        return;
      }
    });
    const newthreadts = await client.chat.postMessage({
      channel: event.channel,
      text: `Ok, connecting you to ${targetUserId}! Please reply in this thread to converse with the other user!`,
    });
    db.run('INSERT INTO target (thisthread, thread, channel) VALUES (?, ?, ?)',
    [firstmes.ts, newthreadts.ts, event.channel], (err) => {
      if (err) {
        console.error('Error:', err);
      }
    });
        
    return;
  }

  if (event.thread_ts && go) {
    const username = saltedhash.substring(0,10);
    db.get('SELECT * FROM messages WHERE user_hash = ?', [saltedhash], async (err, row) => {    
      if (row && row.person_talking_to) {
        const user_talking = row.person_talking_to.split(">")[0].split("|")[0].split("@")[1];
        const dmChannel = await client.conversations.open({
          users: user_talking
        });
        
        let threadts = row.thread;
        await client.chat.postMessage({
          channel: dmChannel.channel.id,
          text: `${event.text}`,
          thread_ts: threadts,
          username: username,
        });
      } else {
        await client.chat.postMessage({
          channel: event.channel,
          text: `Hey! To connect to someone, mention them like: @grass, and replace grass with anyone you like`,
        });
      }
    });
  } else if (go == true) {
    await client.chat.postMessage({
      channel: event.channel,
      text: `Hey! That doesn't work! To connect to someone, mention them like: @Grass, and replace Grass with anyone you like, or please reply in thread.`,
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  app.logger.info('The Jester app is running!');
})();
