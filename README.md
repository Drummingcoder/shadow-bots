# Jester bot

## Description:
This Slack bot checks to see if a certain person is in a channel. Right now,
it can't check if a user is in a channel with more than 1000 people yet or is in a private channel,
but I'm working on removing that limit.


## Usage:
For example, if you wanted to check if a person was in #announcements, you would 
use this format: "@Jester is @user in #confessions-meta?"
Jester is the name of the bot, and it will return a response based on 
whether or not the user is in the channel.

## Deploying the Bot
This bot was made using the Deno Slack SDK, so to install and deploy it yourself,
you need to install the Slack CLI and Deno SDK to deploy the bot.

1. Clone the repository:
    ```bash
    git clone https://github.com/Drummingcoder/find-the-channel.git
    cd find-channel
    ```
2. Deploy the bot:
    ```bash
    slack deploy
    ```

It's as easy as that!

## Video:

Video of the bot in action:

https://github.com/Drummingcoder/find-the-channel/blob/main/Screen%20recording%202025-09-14%203.21.21%20PM.webm
