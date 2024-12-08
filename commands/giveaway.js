const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const giveawayManager = require('../index').giveaway;
const ms = require('ms');

new Command({
	name: 'giveaway',
	description: 'Giveaway',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "start",
            description: "Začít giveaway",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                new Argument({
                    name: "time",
                    description: "Čas (5m)",
                    type: ArgumentType.STRING,
                    required: true
                }),
                new Argument({
                    name: "winners",
                    description: "Počet výherců",
                    type: ArgumentType.INTEGER,
                    required: true
                }),
                new Argument({
                    name: "prize",
                    description: "Cena",
                    type: ArgumentType.STRING,
                    required: true
                }),
                new Argument({
                    name: "channel",
                    description: "Kanál",
                    type: ArgumentType.CHANNEL,
                    required: false
                }),
            ]
        }),
        new Argument({
            name: "reroll",
            description: "Vybere nového výherce",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                new Argument({
                    name: "messageid",
                    description: "ID zprávy",
                    type: ArgumentType.STRING,
                    required: true
                }),
            ]
        }),
        new Argument({
            name: "end",
            description: "Ukončit giveaway",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                new Argument({
                    name: "messageid",
                    description: "ID zprávy",
                    type: ArgumentType.STRING,
                    required: true
                }),
            ]
        }),
    ],
    run: (ctx) => {
        const subcmd = ctx.arguments.getSubcommand()
        if (!ctx.member.roles.cache.has("1315385077223657502")) {
            const embed = new EmbedBuilder()
            .setTitle("Nemáš oprávnění")
            .setDescription("Nemáš oprávnění na spuštění giveaway")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        switch (subcmd) {
            case "start":
                const time = ctx.arguments.getString("time");
                const winners = ctx.arguments.getInteger("winners");
                const prize = ctx.arguments.getString("prize");
                const channel = ctx.arguments.get("channel") || ctx.interaction.channel
                giveawayManager.start(channel, {
                    duration: ms(time),
                    winnerCount: winners,
                    prize: prize,
                    hostedBy: ctx.interaction.user
                })
                const embeds = new EmbedBuilder()
                .setTitle("Giveaway spuštěn!")
                .setColor("Green")
                ctx.reply({embeds: [embeds], ephemeral: true})
            break;

            case "reroll":
                const messageid1 = ctx.arguments.getString("messageid")
                const embed1 = new EmbedBuilder()
                .setTitle("Giveaway")
                .setDescription(`Giveaway byl znovu vylosován`)
                .setColor("Green")

                giveawayManager.reroll(messageid1).then(() => {
                    ctx.reply({embeds: [embed1]})
                })
            break;

            case "end":
                const messageid2 = ctx.arguments.getString("messageid")
                const embed2 = new EmbedBuilder()
                .setTitle("Giveaway")
                .setDescription(`Giveaway byl ukončen`)
                .setColor("Green")
                giveawayManager.end(messageid2).then(() => {
                    ctx.reply({embeds: [embed2]})
                })
            break;
        }
    }
});