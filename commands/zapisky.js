const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'zapisky',
	description: 'Napíše ti odkazy na zápisky',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Zápisky")
        .setDescription("Zde jsou odkazy na zápisky")
        .addFields(
            { name: "Matematika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Matematika.pdf)", inline: true},
            { name: "Český jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/CeskyJazyk.pdf)", inline: true},
            { name: "Anglický jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/AnglickyJazyk.pdf)", inline: true},
            { name: "Dějepis", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Dejepis.pdf)", inline: true},
            { name: "Fyzika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Fyzika.pdf)", inline: true},
            { name: "Celé repo", value: "[Klikni zde](https://github.com/DaneeSkripter/ZapiskySSPS)", inline: true}
        )
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});