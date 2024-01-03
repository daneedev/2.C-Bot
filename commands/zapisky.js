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
            { name: ":1234: Matematika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Matematika)", inline: true},
            { name: ":flag_cz: Český jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/CeskyJazyk)", inline: true},
            { name: ":flag_gb: Anglický jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/AnglickyJazyk)", inline: true},
            { name: ":moyai: Dějepis", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Dejepis)", inline: true},
            { name: ":flag_sk: Fyzika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Fyzika)", inline: true},
            { name: "🐈 Všechny", value: "[Klikni zde](https://zapisky.daneeskripter.dev/)", inline: true}
        )
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});