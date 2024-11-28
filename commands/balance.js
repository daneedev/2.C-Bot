const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')
new Command({
	name: 'balance',
	description: 'Zobrazí tvůj zůstatek na účtu',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "user",
            description: "Uživatel, kterému chceš zobrazit zůstatek",
            type: ArgumentType.USER,
            required: false
        })
    ],
	run: async (ctx) => {
        let user = await User.findOne({where: {discordId: ctx.user.id}})
        const embed = new EmbedBuilder()
        embed.setTitle("💵 Zůstatek")
        embed.setColor("Random")
        if (ctx.arguments.getUser("user")) {
            user = await User.findOne({where: {discordId: ctx.arguments.getUser("user").id}})
            embed.setTitle(`💵 Zůstatek uživatele ${ctx.arguments.getUser("user").username}`)
        }
        embed.addFields(
            {name: "Hotovost", value: `${commaNumber(user.cash)} Kč`, inline: true},
            {name: "Banka", value: `${commaNumber(user.bank)} Kč`, inline: true}
        )
        ctx.reply({embeds: [embed]})
    }
});