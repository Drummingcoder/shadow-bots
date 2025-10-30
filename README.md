# Sans Tracker bot

Now in fall season, would you like a daily reminder in your channel? Need to spend a little less time on Slack? Or just want to monitor your time?
## Description: 
New features (the ones to review):
You can now send a reminder complete with the amount of time you spend on Slack and the amount of time you spent on Hackatime. Simply use the '/createdaily' command in any channel and fill in the channel to send to, your Hackatime API key, the time in 24-hour time to send the reminder, the date to start sending, and your timezone in IANA format! (something like "America/Los_Angeles"). You will get a confirmation message in the channel that you send it to.

At the time that you specified, every day, the bot will send a summary of your activity as well as comments related to the time you spent on Slack and Hackatime that fits the fall season. You can then reply in the thread with details about your day. If you start the reply with "Day ##:" (replace ## with any number), the bot will pin the parent message to the channel. If not, it will not pin the thread. Regardless of how you start your message, the bot will respond with comments to either cheer you up and have fun depending on what you tell it.

The bot needs to be in the channel that you are going to send the reminder to in order for it to work. You also need to be registered with the Sans time tracking feature as well.

You can also use the '/testmydaily' command to instantly try out the reminder in the channel that you run the command in. Just make sure to provide your api key!

Old features: 
To start time tracking, mention the bot in Hack Club Slack channel #jesterly-hub.
Don't include any other keywords like coins, "time today", or stop or else the bot
won't respond. Follow the bot's prompts and respond with simple yes or nos (I need
to make this more robust in the future). There's no need to ping the bot again, in
fact, when answering the prompt, don't ping the bot, or else it will break. Once
you answer yes to the last prompt, the bot will begin to track your time.

The bot uses your presence (the green light next to your profile) to determine
if you're online or offline. Please don't manually set your presence to away unless
you're actually going offline, or else the bot will not track your time correctly.
For every 30 minutes you spend on Slack, the bot will ping you in #jesterly-hub
updating you about the amount of time you've spent today on Slack, unless you spend
coins to skip it.

Speaking about coins, the bot is programmed to give you 1 coin for every hour you
spend off Slack. This coin-giving will happen at 12:00 PST, where the bot will
reset time active and away (perhaps in the future, it can keep a log on this), and
distribute coins accordingly.

To spend coins to skip the pings, use the command '/timetospend'. A form will show
up showing you how many coins you have and allow you to enter a number of coins to
spend. It was coded to prevent high numbers past the amount you have, so don't try
it. As it's 1 coin per ping, if you spent 3 coins, the next 3 pings will be skipped.
If you don't want to spend on skipping pings, well you can enjoy the hard-earned
intrisic joy of seeing a number go up day by day.

To see your coins count or your time active today, mention the bot in a channel
that it's in and state your request. You can say either "coins" or "time today"
(the whole phrase, just "time" won't work) to see your coin count or the time
tracked today.

## Deploying the Bot
This bot was made using the Deno Slack SDK, so to install and deploy it yourself,
you need to install the Slack CLI and Deno SDK to deploy the bot.
The Sans Tracker bot's code is stored inside the sans folder.

1. Clone the repository:
    ```bash
    git clone https://github.com/Drummingcoder/find-the-channel.git
    cd sans
    ```
2. Deploy the bot:
    ```bash
    slack deploy
    ```

It's as easy as that!

Video demo of the Sans bot's daily reminder (form at the end is the reminder creation screen): 
https://github.com/user-attachments/assets/4b0eb55f-fb1d-4ea0-99c9-38bced782e80
