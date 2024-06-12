const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');


new Command({
	name: 'yapper',
	description: 'Pošle fotku yappera',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	cooldown: "2s",
    arguments: [
        new Argument({
            name: 'user',
            description: 'Uživatel, ktery yappuje',
            type: ArgumentType.USER,
            required: true
        })
    ],
	run: async (ctx) => {
        const user = await ctx.arguments.getUser('user')
		const canvas = createCanvas(508, 485),
            cv = canvas.getContext('2d'),
            bg = await loadImage(__dirname + "/../img/yapping.png"),
            userImg = await loadImage(user.displayAvatarURL({ dynamic: false}).replace("webp", "png"))
        cv.drawImage(bg, 0, 0, canvas.width, canvas.height)
        cv.drawImage(userImg, 290, 180, 75, 75)

        const at = new AttachmentBuilder(canvas.toBuffer(), "yapper.png")
        ctx.reply({files: [at]})
	}
});