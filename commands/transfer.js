const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')

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
        if (user.inGame === true) {
            const embed = new EmbedBuilder()
            .setTitle("Nemůžeš použít ekonomiku")
            .setDescription("Nemůžeš použít ekonomiku, když jsi v hře")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        if (amount <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Neplatná částka")
            .setDescription("Částka musí být kladná")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
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
            .setDescription(`Vložil jsi ${commaNumber(amount)} Kč do banky`)
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
            .setDescription(`Vybral jsi ${commaNumber(amount)} Kč z banky`)
            .setColor("Random")
            ctx.reply({embeds: [embed]})
        }
    }
});
