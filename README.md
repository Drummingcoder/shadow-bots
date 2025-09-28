# Dokeshi bot

A fun bot for Hack Clubbers to laugh with and play each other!
## Description: 
Features: 
Start a game with '/playOmniRPS' (you can see the vision, right now it's just a regular RPS Bot). Simply put in who you want to play against and the channel to play in! The bot will send an initial "challenge declared" message, use the buttons in the reply to throw your move and see who wins! Note: another game can't be started unless the previous game has finished.
To flip a coin, in any channel, mention the bot @Dokeshi and say "flip a coin" or "flip coin", so like "@Dokeshi flip a coin". The bot will respond with heads or tails.
To roll an 8-ball, mention the bot and say something like '@Dokeshi Ask the 8-ball, "Should I leave my school?"' (the key word is 8-ball). The bot will roll the 8-ball and come up with a response.
To roll a variable amount of dice, mention the bot and say something like "roll 2 dice" (the number can be any number, like 61 or 34), so you say something like "@Dokeshi roll 3 dice". Don't deviate from this form or else the bot will not work, so something like "@Dokeshi please roll 4 dice" won't work.

## Deploying the Bot
This bot was made using the Deno Slack SDK, so to install and deploy it yourself,
you need to install the Slack CLI and Deno SDK to deploy the bot.
The Dokeshi bot's code is stored inside the gamers folder.

1. Clone the repository:
    ```bash
    git clone https://github.com/Drummingcoder/find-the-channel.git
    cd gamers
    ```
2. Deploy the bot:
    ```bash
    slack deploy
    ```

It's as easy as that!

## Video:
Video of RPS in action:
https://github.com/user-attachments/assets/66f3820a-1926-4501-b9f5-b58e5c238adc
