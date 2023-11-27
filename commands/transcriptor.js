const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const { spawnSync } = require('child_process');
const fs = require('fs');
const ms = require("ms")
const package = require("../package.json")

function transcribe(videoUrl, language='cs-CZ') {
    const pythonScriptPath = 'yt-transcriptor/main.py';
    const pythonScriptArguments = [videoUrl, 'lang='+language];

    console.log(fs.existsSync(pythonScriptPath) ? "Python script found" : "Python script not found");

    console.log("Running Python script with arguments:", pythonScriptArguments);

    const result = spawnSync('python', [pythonScriptPath, ...pythonScriptArguments], { stdio: 'inherit' });

    console.log("Python script finished with code:", result.status)

    if (result.error) {
        console.error('Error calling Python script:', result.error);
        return false;
    }

    return true;
}

new Command({
    name: 'transcript',
    description: 'Get transcriptions of a YouTube video',

    type: [CommandType.SLASH],

    arguments: [
        new Argument({
            name: 'url',
            description: 'URL of the YouTube video',
            type: ArgumentType.STRING,
            required: true
        }),

        new Argument({
            name: 'language',
            description: 'Default: cs-CZ',
            type: ArgumentType.STRING,
            required: false
        }),
    ],

    run: (ctx) => {
        // Get the video ID, URL and file path
        const videoUrl = ctx.arguments.getString('url');
        const videoId = videoUrl.split('v=')[1];

        if (videoId.includes("&")) {
            videoId = videoId.split("&")[0]
        }

        const filePath = './transcriptions/' + videoId + '.txt';

        // Check if the video has already been transcribed
        if (!fs.existsSync(filePath)) {
            console.log('Transcribing video URL "' + videoUrl + '". This may take a while...');
            ctx.reply({
                content: 'Transcribing video URL "' + videoUrl + '". This may take a while...',
                ephemeral: true,
            });

            // Transcribe the video
            const success = transcribe(videoUrl);

            if (!success) {
                ctx.reply({
                    content: 'An error occurred while transcribing the video URL "' + videoUrl + '".',
                    ephemeral: true,
                });
                return;
            }
        }

        // Send the transcriptions as a text file
        console.log('Sending transcriptions for video URL "' + videoUrl + '"');
        ctx.reply({
            content: 'Transcriptions for video URL "' + videoUrl + '"',
            files: [filePath],
            ephemeral: true,
        });
    }
});