const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/AuctionUser")

new Command({
	name: 'aukceunban',
	description: 'Odebere uživateli aukční ban',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "user",
            description: "Uživatel, kterému se má odebrat ban",
            required: true,
            type: ArgumentType.USER
        })
    ],
	run: async (ctx) => {
        if (ctx.member.roles.cache.some(r => r.id == "1150872350091395233")) {
        const user = ctx.arguments.getUser("user")
        const userDB = await User.findOne({userID: user.id})
        if (!userDB) {
            const embed = new EmbedBuilder()
            .setTitle("Aukční ban")
            .setDescription(`Uživatel ${user} nemá aukční ban`)
            .setColor("Random")
            ctx.reply({embeds: [embed]})
            return
        } else {
        await User.deleteOne({userID: user.id})
        const embed = new EmbedBuilder()
        .setTitle("Aukční ban")
        .setDescription(`Uživateli ${user} byl aukční ban odebrán.`)
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
    } else {
        const embed = new EmbedBuilder()
        .setTitle("Aukční ban")
        .setDescription(`Nemáš práva na odebrání aukčního banu`)
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
    }
});