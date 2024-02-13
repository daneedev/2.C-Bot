const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'uctenka',
	description: 'Zobrazí ti účtenku do Tesca',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Tesco účtenka")
        .setDescription("Účtenku lze neomezeně použít u výstupu")
        .setImage("https://cloud.daneeskripter.dev/sf/daneeskripter/uctenka.jpg")
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
});