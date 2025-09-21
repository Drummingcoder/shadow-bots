# Jester bot
A fun bot for Hack Clubbers to laugh with and enjoy!
## Description:
New features (the ones to be reviewed): 
You can anonymously react to any message with an emoji of your choice! Just use the shortcut '/anon-emoji' and provide the message link and the emoji name (without colons) in the form provided. It works in any private or public channel, even if it's not in the channel!. You can also remove a reaction made with Jester by reacting with the same emoji on the same message, which does mean only one person can react to the message with the same emoji (meaning that if one person reacts to a message with one emoji and another person reacts with the same emoji on that message, the reaction will be removed). 

You can also react to all new messages of a certain person using the '/annoy-emoji' command, which means that if you put something like a grass emoji on a person like @grass, all new messages that grass sends will be reacted to with the grass emoji. This only works if the bot is in the channel (public or private). All you need to do is enter the user and the emoji into the form that shows up! To remove the auto-react, simply type reenter the form and choose the same person and emoji. If you choose a different emoji, the auto-react will simply be updated with the new reaction.

Old features:
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

Video of the anon-emoji and annoy-emoji in action:


Video of the channel checking feature of the bot in action:
[https://github.com/Drummingcoder/find-the-channel/blob/main/Screen%20recording%202025-09-14%203.21.21%20PM.webm](https://github.com/user-attachments/assets/a17aed3b-d09f-4444-9b0b-bd9b1c4da554)
