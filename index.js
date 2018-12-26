// Modules
const Telegraf = require('telegraf');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

// Files
const config = require(`./config.json`);

// Variables
var vidID = 1;
var downurl = "https://www.youtube.com/watch?v=";
const directory = `${__dirname}/cache`;

// --------
// DOC
// add bot token in "config.json"
// {
//    "token": "placeTokenHere"   
// }
// npm install ytdl-core --save
// node index.js

// Bot setup
const bot = new Telegraf(config.token);
console.log("Bot is running;; TOKEN: " + config.token);
bot.start((ctx) => ctx.reply('Hey there!'));
bot.help((ctx) => ctx.reply('Send me a link and I will send you the vid :) \n cmds: \n \n /video {videoID} -- is downloading the video \n /get -- is sending the video \n /clear -- clears all videos from cache'));
bot.startPolling();

// Download Video to Server
bot.command('/video', (ctx) => {
    videoId();
    let input = ctx.message["text"];
    let subText = input.split(" ");
    let out = downurl + subText[1];
    console.log(out);
    ytdl(out, "lowest", "videoonly")
        .pipe(fs.createWriteStream(`${__dirname}/cache/${vidID}.flv`))
    ctx.reply(`Video has been downloaded! SavingID = ${vidID}`);

    if (vidID > 9) {
        clearStorage();
        ctx.reply('Server storage cleared!')
    }
})

// Send video to User
bot.command('/get', (ctx) => {
    ctx.reply('Sending video...');
    try {
        console.log("Sending video...");
        ctx.replyWithVideo({
            source: fs.createReadStream(`${__dirname}/cache/${vidID}.flv`)
        })
    } catch (err) {
        ctx.reply("Error");
    }
})

// Clear videos from cache
bot.command('/clear', (ctx) => {
    clearStorage();
    ctx.reply('All videos removed');
})

// Functions

// Count videoId++
function videoId() {
    return vidID++;
}

// Clear Cache
function clearStorage() {
    fs.readdir(directory, (err, files) => {
        if (err) console.log(err);

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) console.log(err);
            });
        }
    });
}

// Catch all errors from bot
bot.catch(function (error) { console.log(err) });
