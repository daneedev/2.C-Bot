const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const User = require('../models/User');
const commaNumber = require('comma-number');

new Command({
	name: 'leaderboard',
	description: 'Ukaze ti leaderboard',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "type",
            description: "leaderboard type",
            type: ArgumentType.STRING,
            required: true,
            choices: [
                {
                    name: "Zprávy",
                    value: "msg"
                },
                {
                    name: "Hlášky",
                    value: "hlasky"
                },
                {
                    name: "Zapisovatelé hlášek",
                    value: "zapisovatele"
                },
                {
                    name: "Počet 💀",
                    value: "skull"
                },
                {
                    name: "Peníze",
                    value: "money"
                }
            ]
        })
    ],
	run: async (ctx) => {
            const type = ctx.arguments.getString("type")
            const users = await User.findAll()
            if (type === "msg") {
                const sortedUsers = users.sort((a, b) => b.dataValues.pocetZprav - a.dataValues.pocetZprav)
                const embed = new EmbedBuilder()
                .setTitle("Messages leaderboard")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers, "msg"))
                ctx.reply({embeds: [embed]})
            } else if (type === "hlasky") {
                const sortedUsers = users.sort((a, b) => b.dataValues.pocetHlasek - a.dataValues.pocetHlasek)
                const embed = new EmbedBuilder()
                .setTitle("Hlášky leaderboard")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers, "hlasky"))
                ctx.reply({embeds: [embed]})
            } else if (type === "zapisovatele") {
                const sortedUsers = users.sort((a, b) => b.dataValues.pocetZapisu - a.dataValues.pocetZapisu)
                const embed = new EmbedBuilder()
                .setTitle("Zapisovatelé hlášek leaderboard")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers, "zapisovatele"))
                ctx.reply({embeds: [embed]})
            } else if (type === "skull") {
                const sortedUsers = users.sort((a, b) => b.dataValues.pocetSkull - a.dataValues.pocetSkull)
                const embed = new EmbedBuilder()
                .setTitle("Počet 💀")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers, "skull"))
                ctx.reply({embeds: [embed]})
            } else if (type === "money") {
                const sortedUsers = users.sort((a, b) => (b.dataValues.cash + b.dataValues.bank) - (a.dataValues.cash + a.dataValues.bank))
                const embed = new EmbedBuilder()
                .setTitle("Peníze leaderboard")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers, "money"))
                ctx.reply({embeds: [embed]})
            }
    }
});

// KOD VYPUJCEN OD VITKA ADAMA
// PS: tim vypujcen myslim ze jsem to ukrad haha
function rankUsers(users, type) {
    let rank = 0
    let previousScore;
    let winners = 0
    let ranktext = ""
    let data;
    users.forEach(user => {
        if (type === "msg") {
            data = user.dataValues.pocetZprav
        } else if (type === "hlasky") {
            data = user.dataValues.pocetHlasek
        } else if (type === "zapisovatele") {
            data = user.dataValues.pocetZapisu
        } else if (type === "skull") {
            data = user.dataValues.pocetSkull
        } else if (type === "money") {
            data = commaNumber(user.dataValues.cash + user.dataValues.bank)
        }

        if (data === 0) {
            return;
        } else if (data != previousScore) {
            if (winners < 5) {
                rank += 1
                previousScore = data
            } else {
                return;
            }
        } 
        if (user.dataValues.discordId) {
            ranktext += `**${rank}. místo** <@${user.dataValues.discordId}> - ${data}\n`
        } else {
            ranktext += `**${rank}. místo** ${user.dataValues.name} - ${data}\n`
        }
        ranktext = ranktext.replace("1.", "🥇").replace("2.", "🥈").replace("3.", "🥉")
        winners += 1

        if (rank >= 5) {
            return;
        }
    })
    return ranktext
}