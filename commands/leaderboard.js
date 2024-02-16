const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');

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
                const users = JSON.parse(fs.readFileSync(__dirname + "/../data/messages.json"))
                const sortedUsers = users.sort((a, b) => b.count - a.count)
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
        if (user.count != previousScore) {
            if (winners < 3) {
                rank += 1
                previousScore = user.count
            } else {
                return;
            }
        }
        ranktext += `**${rank}. místo** <@${user.user}> - ${user.count} zpráv\n`
        ranktext = ranktext.replace("1.", "🥇").replace("2.", "🥈").replace("3.", "🥉")
        winners += 1

        if (rank >= 3) {
            return;
        }
    })
    return ranktext
}