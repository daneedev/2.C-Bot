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
            { name: ":1234: Matematika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Matematika.pdf)", inline: true},
            { name: ":flag_cz: Český jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/CeskyJazyk.pdf)", inline: true},
            { name: ":flag_gb: Anglický jazyk", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/AnglickyJazyk.pdf)", inline: true},
            { name: ":moyai: Dějepis", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Dejepis.pdf)", inline: true},
            { name: ":flag_sk: Fyzika", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Fyzika.pdf)", inline: true},
            { name: ":symbols: Matematika vzorce", value: "[Klikni zde](https://zapisky.daneeskripter.dev/1rocnik/Matematika_vzorce.pdf)", inline: true},
            { name: "🐈 Všechny", value: "[Klikni zde](https://zapisky.daneeskripter.dev/)", inline: true}
        )
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});