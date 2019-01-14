# Telegram Youtube-Downloader

This bot sends videos from Youtube to Telegram. I made this bot because when I was in vacations I had a social media flat where I couldn't access Youtube (cruise ship aka. Aida). I just could use messengers like Telegram.

Because Telegram has a limitation for sending videos the largest possible videos that could be send could have a size of 50MB. Telegram recently made a post where they wrote that they will increase this value soon.
Have fun with this little work around :D

Important infos:
- Mutltiple users at the same time possible
- Self hosting => Telegram blocks bots that violate the copright
    - You can use the bot on your own risk

# Documentation

## Install / Self Hosting

First install the nodejs and npm packages
```
sudo apt-get install nodejs
```
```
sudo apt-get install npm
```

then clone the git repos to your Server
```
git clone https://github.com/corusm/t-youtube-downloader.git
```

## Install dependencies
```
npm install
```

## Create Bot
Here there are incstructions for creating a Telegram Bot
1. [Create Telegram Bot](https://www.sohamkamani.com/blog/2016/09/21/making-a-telegram-bot/)

## Add Tokens
Add your discord and telegram bot token to the **config.json** file
```
{
  "telegram": "placeYourTokenHere"
}
```

## Run the bot
Navigate to the directory where you have installed the bot (where the **index.js** file is located) and run these commands:

1. Start Bot: `npm start`
2. Stop Bot: `npm stop`
3. Test Bot: `npm test`

## Log
All the logs that you see in the shell also get logged in the **info.log** file.

# Commands

## Telegram Command(s):
Let the bot send you the video :D:
* **/video "youtubeVideoID"**

For searching videos use the bot with the username [@youtube](https://telegram.me/youtube).

# Help me improving this bot! 
If there is any bug to fix or you have a feature request do not hesitate to conctact me!
