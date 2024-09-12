const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'zapisky',
	description: 'Napíše ti odkazy na zápisky',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Zápisky")
        .setDescription("Zde nalezneš veškeré zápisky z předmětů: https://zapisky.danee.dev/")
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});