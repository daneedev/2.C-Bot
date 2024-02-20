const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const User = require('../models/User');

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
                    name: "Messages leaderboard",
                    value: "msg"
                },
            ]
        })
    ],
	run: async (ctx) => {
            const type = ctx.arguments.getString("type")
            if (type === "msg") {
                const users = await User.findAll()
                const sortedUsers = users.sort((a, b) => b.dataValues.pocetZprav - a.dataValues.pocetZprav)
                const embed = new EmbedBuilder()
                .setTitle("Messages leaderboard")
                .setColor("Random")
                .setDescription(rankUsers(sortedUsers))
                ctx.reply({embeds: [embed]})
            }
    }
});

// KOD VYPUJCEN OD VITKA ADAMA
// PS: tim vypujcen myslim ze jsem to ukrad haha
function rankUsers(users) {
    let rank = 0
    let previousScore;
    let winners = 0
    let ranktext = ""
    users.forEach(user => {
        if (user.dataValues.pocetZprav != previousScore) {
            if (winners < 3) {
                rank += 1
                previousScore = user.dataValues.pocetZprav
            } else {
                return;
            }
        }
        ranktext += `**${rank}. místo** <@${user.dataValues.discordId}> - ${user.dataValues.pocetZprav} zpráv\n`
        ranktext = ranktext.replace("1.", "🥇").replace("2.", "🥈").replace("3.", "🥉")
        winners += 1

        if (rank >= 3) {
            return;
        }
    })
    return ranktext
}