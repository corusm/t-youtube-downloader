// Modules
const Telegraf = require('telegraf');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

// Files
const config = require(`${__dirname}/config.json`);
const videos = require(`${__dirname}/videos.json`);

// Global Vars
var VID_ID = 1;
var DOWN_URL = "https://www.youtube.com/watch?v=";
const DIRECTORY = `${__dirname}/cache`;

// Bot setup
const bot = new Telegraf(config.token);
console.log("Bot is running;; TOKEN: " + config.token);
bot.start((ctx) => ctx.reply('Hey there!'));
bot.help((ctx) => ctx.reply('Send me a link and I will send you the vid :) \n cmds: \n \n /video {videoID} -- is downloading the video \n /get -- is sending the video \n /clear -- clears all videos from cache'));
bot.startPolling();

// Catch all errors from bot
bot.catch(function (err) { console.log(err) });

// Commands
// Download Video to Server
bot.command('/video', async (ctx) => {
    let userID = ctx.from["id"];

    let input = ctx.message["text"];
    let subText = input.split(" ");
    let subSplit;
    let out;

    if (subText[1].includes("https://youtu.be/")) {
        subSplit = subText.split(".be/");
        out = DOWN_URL + subSplit[1]
    } else {
        out = DOWN_URL + subText[1];
    }
    console.log(out);

    // await downloadVideo(out, userID);
    try {
        await test(out, userID);
        ctx.reply("Video saved on Server");
        ctx.reply('Sending video...');
        console.log("Sending video...");
        await sendVideo(userID);
        // var readStream = await fs.createReadStream(`${__dirname}/cache/1.flv`);
        /* await ctx.replyWithVideo({
            source: readStream
        }) */
        ctx.reply("test");
    } catch (err) {
        console.log(err);
    }
})

async function test(out, userID) {
    try {
        await ytdl(out, "lowest", "videoonly")
            .pipe(fs.createWriteStream(`${__dirname}/cache/1.flv`))
    } catch (err) {
        console.log("didnt work!");
    }
}

async function sendVideo(userID) {
    var readStream = await fs.createReadStream(`${__dirname}/cache/1.flv`);
    await bot.telegram.sendVideo(userID, readStream);
}

// Send video to User
bot.command('/get', (ctx) => {
    ctx.reply('Sending video...');
    console.log("Sending video...");
    ctx.replyWithVideo({
        source: fs.createReadStream(`${__dirname}/cache/${vidID}.flv`)
    })
})

// Clear videos from cache
bot.command('/clear', (ctx) => {
    clearStorage();
    ctx.reply('All videos removed');
})

// Functions

// Count videoId++
function videoId(userID) {
    try {
        let counter;
        if (videos.userID) {
            counter = videos.userID;
        } else {
            counter = 1;
        }
        videos[userID] = counter;
        fs.writeFile(videos, JSON.stringify(videos), function (err) { // rewrites users.json File
            if (err) return console.log(err);
            logger.log("info", "Users updated: " + counter)
        });

    } catch (err) {
        console.log(err);
    }
}

// Clear Cache
function clearStorage(userID) {
    let finalDir = DIRECTORY + "/" + userID;
    try {
        fs.readdir(finalDir, (err, files) => {
            if (err) console.log(err);

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) console.log(err);
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

async function downloadVideo(videoURL, userID) {
    try {
        // videoId(userID);
        if (!fs.existsSync(`${DIRECTORY}/${userID}`)) {
            fs.mkdirSync(`${DIRECTORY}/${userID}`);
        }

        await ytdl(videoURL, "lowest", "videoonly").pipe(fs.createWriteStream(`${__dirname}/cache/1.flv`))
    } catch (err) {
        console.log(err);
    }
}
