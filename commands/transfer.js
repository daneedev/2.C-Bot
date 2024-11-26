const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");

new Command({
	name: 'transfer',
	description: 'Převeď peníze z/do banky',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "type",
            description: "Typ transakce",
            type: ArgumentType.STRING,
            choices: [
                {name: "Vklad", value: "deposit"},
                {name: "Výběr", value: "withdraw"}
            ],
            required: true
        }),
        new Argument({
            name: "amount",
            description: "Částka",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
	run: async (ctx) => {
        const user = await User.findOne({where: {discordId: ctx.user.id}})
        const type = ctx.arguments.getString("type")
        const amount = ctx.arguments.getInteger("amount")
        if (type === "deposit") {
            if (user.cash < amount) {
                const embed = new EmbedBuilder()
                .setTitle("Nedostatek peněz")
                .setDescription("Nemáš dostatek peněz na vklad")
                .setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
                return
            }
            user.cash -= amount
            user.bank += amount
            user.save()
            const embed = new EmbedBuilder()
            .setTitle("Vklad")
            .setDescription(`Vložil jsi ${amount} Kč do banky`)
            .setColor("Random")
            ctx.reply({embeds: [embed]})
        } else {
            if (user.bank < amount) {
                const embed = new EmbedBuilder()
                .setTitle("Nedostatek peněz")
                .setDescription("Nemáš dostatek peněz na výběr")
                .setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
                return
            }
            user.cash += amount
            user.bank -= amount
            user.save()
            const embed = new EmbedBuilder()
            .setTitle("Výběr")
            .setDescription(`Vybral jsi ${amount} Kč z banky`)
            .setColor("Random")
            ctx.reply({embeds: [embed]})
        }
    }
});