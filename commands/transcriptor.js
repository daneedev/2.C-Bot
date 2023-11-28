const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { spawnSync } = require('child_process');
const fs = require('fs');

function transcribe(videoUrl, language) {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = 'yt-transcriptor/main.py';
        const pythonScriptArguments = [videoUrl, 'lang=' + language || 'cs-CZ'];
        console.log(fs.existsSync(pythonScriptPath) ? "Python script found" : "Python script not found");
        console.log("Running Python script with arguments:", pythonScriptArguments);
        const result = spawnSync('python3', [pythonScriptPath, ...pythonScriptArguments], { stdio: 'inherit' });
        console.log("Python script finished with code:", result.status);
        if (result.error) {
            console.error('Error calling Python script:', result.error);
            reject(new Error('An error occurred while transcribing the video.'));
        } else {
            resolve();
        }
    });
}

new Command({
    name: 'transcribe',
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

    run: async (ctx) => {
        const videoUrl = ctx.arguments.getString('url');

            if (!videoUrl.includes("v=")) {
                ctx.reply('Invalid YouTube video URL.')
            } else {

            

        const videoId = videoUrl.split('v=')[1];

        if (videoId.length == 0) {
            return
        }

        const language = ctx.arguments.getString('language') || 'cs-CZ';

        if (language.length == 0) {
            return
        } else if (language.length > 7) {
            return
        }

        if (videoId.includes("&")) {
            videoId = videoId.split("&")[0]
        }

        const filePath = './transcriptions/' + videoId + language.split('-')[0] + '.txt';

        // Check if the video has already been transcribed
        if (!fs.existsSync(filePath)) {
            console.log('Transcribing video. This may take a while...');
            await ctx.deferReply({
                content: 'Transcribing video. This may take a while...',
            });

            try {
                // Transcribe the video
                await transcribe(videoUrl, language);
                console.log('Sending transcriptions for video URL');
                await ctx.editReply({
                    content: `Transcriptions for video:`,
                    files: [filePath],
                }).then((msg) => {
                    msg.reply(`<@${ctx.user.id}>`)
                });
            } catch (error) {
                ctx.editReply({
                    content: error.message || 'An error occurred while transcribing the video URL.',
                    ephemeral: true
                });
            }
        } else {
            await ctx.deferReply({
                content: 'Getting transcriptions for video. This may take a while...',
            });
            console.log('Sending transcriptions for video');
            await ctx.editReply({
                content: `Transcriptions for video:`,
                files: [filePath],
            }).then((msg) => {
                msg.reply(`<@${ctx.user.id}>`)
            });
        }
    }
    }
});
