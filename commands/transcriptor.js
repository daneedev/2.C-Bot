const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const { spawnSync } = require('child_process');
const fs = require('fs');
const ms = require("ms")
const package = require("../package.json")

function transcribe(videoUrl) {
    const pythonScriptPath = '../yt_transcriptor/main.py';
    const pythonScriptArguments = [videoUrl, 'lang=cs-CZ'];

    const result = spawnSync('python', [pythonScriptPath, ...pythonScriptArguments]);

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

    run: (ctx) => {
        // Get the video ID, URL and file path
        const videoId = ctx.options.get('url').value;
        const videoUrl = "https://www.youtube.com/watch?v=" + videoId;
        const filePath = './transcriptions/' + videoId + '.txt';

        // Check if the video has already been transcribed
        if (!fs.existsSync(filePath)) {
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
        ctx.reply({
            content: 'Transcriptions for video URL "' + videoUrl + '"',
            files: [filePath],
            ephemeral: true,
        });
    }
});