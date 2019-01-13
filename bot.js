// Modules
const Telegraf = require('telegraf');
const fs = require('fs');
const youtubedl = require('youtube-dl');

// Other Files
// Init winston logger (logger.js)
var outplaced = require(`${__dirname}/logger.js`);
var logger = outplaced.logger;

// Files
const config = require(`${__dirname}/config.json`);

// Global Vars
var DOWN_URL = "https://www.youtube.com/watch?v=";
var infor;
var TeleMaxData = 50; // 50mb || This mighth change in Future!
var videosize;

// Bot setup
const bot = new Telegraf(config.token);
logger.log('info', "Bot is running;; TOKEN: " + config.token);
bot.start((ctx) => ctx.reply('Hey there!'));
bot.help((ctx) => ctx.reply('Send me a link and I will send you the vid :) \n cmds: \n \n /video {videoID or shortened yt link}'));
bot.startPolling();

// Catch all errors from bot
bot.catch(function (err) { logger.log('info', err) });

// Commands
bot.command('/video', async (ctx) => {
    let userID = ctx.from["id"];

    let input = ctx.message["text"];
    let subText = input.split(" ");
    let subSplit;
    let videoURL;

    logger.log('info', `-----------NEW_DOWNLOAD_BY_${userID}-----------`);

    if (subText[1].includes("https://youtu.be/")) {
        subSplit = subText.split(".be/");
        videoURL = DOWN_URL + subSplit[1]
    } else {
        videoURL = DOWN_URL + subText[1];
    }
    logger.log('info', `Youtube video URL: ${videoURL}`);

    // Remove previous video from cache!
    if (fs.existsSync(`${__dirname}/cache/${userID}.mp4`)) {
        fs.unlink(`${__dirname}/cache/${userID}.mp4`, (err) => {
            if (err) logger.log('info', err);
            logger.log('info', `${__dirname}/cache/${userID}.mp4 was deleted`);
        });
    }

    // Download video
    var video = youtubedl(videoURL,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname });

    // Will be called when the download starts.
    video.on('info', function (info) {
        infor = info;
        videosize = infor.size / 1000000;

        if (videosize < TeleMaxData) {
            video.pipe(fs.createWriteStream(`${__dirname}/cache/${userID}.mp4`));

            // Status of Download
            var pos = 0;
            video.on('data', function data(chunk) {
                pos += chunk.length;
                if (infor.size) {
                    let percent = (pos / infor.size * 100).toFixed(2);
                    process.stdout.cursorTo(0);
                    process.stdout.clearLine(1);
                    process.stdout.write(percent + '%');
                }
            })

            video.on('end', async function () {
                logger.log("info", "Download completed");
                try {
                    ctx.reply(`Download completed!\nVideo gets Send! - This might take a few Seconds! \n \n Title: \n ${infor.title}. It's ${videosize}mb big.`);
                    logger.log('info', `Video gets Send! - This might take a few Seconds! \n Title: ${infor.title}, Size: ${infor.size}`);
                    await ctx.replyWithVideo({
                        source: fs.createReadStream(`${__dirname}/cache/${userID}.mp4`)
                    })
                } catch (err) {
                    logger.log("info", "Error: sendVideo");
                    ctx.reply('Error: sendVideo');
                }
            })
        } else {
            ctx.reply(`The Video is ${videosize}mb. The maximum size for sending videos from Telegram is ${TeleMaxData}mb.`);
            logger.log('info', `The Video size is to big! (${videosize}mb)`);
        }
    });
})