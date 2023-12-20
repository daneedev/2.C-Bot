const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'clubcard',
	description: 'Zobrazí ti tesco clubcard',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Tesco Clubcard")
        .setImage("https://cloud.daneeskripter.dev/sf/daneeskripter/clubcard.jpg")
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
});