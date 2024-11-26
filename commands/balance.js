const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");

new Command({
	name: 'balance',
	description: 'Zobrazí tvůj zůstatek na účtu',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: async (ctx) => {
        const user = await User.findOne({where: {discordId: ctx.user.id}})
        const embed = new EmbedBuilder()
        .setTitle("💵 Zůstatek")
        .addFields(
            {name: "Hotovost", value: `${user.cash} Kč`, inline: true},
            {name: "Banka", value: `${user.bank} Kč`, inline: true}
        )
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});