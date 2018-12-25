const Telegraf = require('telegraf');
const fs = require('fs');
const ytdl = require('ytdl-core');

// DOC
// add bot token in "config.json"
// {
//    "token": "placeTokenHere"   
// }
// npm install ytdl-core --save
// node index.js

const config = require(`./config.json`);

console.log("Bot is running;; TOKEN: " + config.token);

const bot = new Telegraf(config.token);
bot.start((ctx) => ctx.reply('Hey there!'));
bot.help((ctx) => ctx.reply('Send me a link and I will send you the vid :) \n cmds: \n \n /video {videoURL} -- is downloading the video \n /get -- is sending the video'));
bot.startPolling();

// Download Video to Server
bot.command('/video', (ctx) => {
    let input = ctx.message["text"];
    let subText = input.split(" ");
    ytdl(subText[1])
        .pipe(fs.createWriteStream(`${__dirname}/video.mp4`))
    ctx.reply('Video has been downloaded!');
})

// Send video to User
bot.command('/get', (ctx) => {
    ctx.reply('Sending video...');
    ctx.replyWithVideo({
        source: fs.createReadStream(`${__dirname}/video.mp4`)
    })
})