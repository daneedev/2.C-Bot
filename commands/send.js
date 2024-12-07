const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')

new Command({
	name: 'send',
	description: 'Pošli někomu peníze',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "user",
            description: "Uživatel, kterému chceš poslat peníze",
            type: ArgumentType.USER,
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
        const user = ctx.arguments.getUser("user")
        const amount = ctx.arguments.getInteger("amount")
        const target = await User.findOne({where: {discordId: user.id}})
        const userDB = await User.findOne({where: {discordId: ctx.user.id}})

        if (user.id === ctx.user.id) {
            const embed = new EmbedBuilder()
            .setTitle("Nelze poslat peníze sám sobě")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        if (amount > userDB.cash) { 
            const embed = new EmbedBuilder()
            .setTitle("Nemáš dostatek peněz")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        if (amount < 1) {
            const embed = new EmbedBuilder()
            .setTitle("Nelze poslat")
            .setDescription("Nelze poslat méně než 1 Kč")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
       } 
        target.cash += amount
        target.save()
        userDB.cash -= amount
        userDB.save()
        const embed = new EmbedBuilder()
        .setTitle("Peníze byly poslány")
        .setDescription(`<@${ctx.user.id}> poslal <@${user.id}> ${commaNumber(amount)} Kč`)
        .setColor("Green")
        ctx.reply({embeds: [embed]})

    }
});