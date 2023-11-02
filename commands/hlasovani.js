const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require('discord.js')
const ms = require('ms')

new Command({
	name: 'hlasovani',
	description: 'Vytvoří hlasování',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'question',
            description: 'Otázka',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'answera',
            description: 'Odpověď A',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'answerb',
            description: 'Odpověď B',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'time',
            description: 'Čas na zodpovězení otázky',
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
        const question = ctx.arguments.getString('question')
        const answera = ctx.arguments.getString('answera')
        const answerb = ctx.arguments.getString('answerb')
        const time = ctx.arguments.getString('time')
        const buttonA = new Discord.ButtonBuilder()
        .setCustomId("buttonA")
        .setLabel(answera)
        .setStyle(Discord.ButtonStyle.Primary)

        const buttonB = new Discord.ButtonBuilder()
        .setCustomId("buttonB")
        .setLabel(answerb)
        .setStyle(Discord.ButtonStyle.Secondary)

        const row = new Discord.ActionRowBuilder()
        .addComponents(buttonA, buttonB)
        let votesA = 0
        let votesB = 0
        const reply = new Discord.EmbedBuilder()
        .setTitle("Hlasování bylo spuštěno")
        .setColor("Random")
        ctx.reply({embeds: [reply], ephemeral: true})
        const mainembed = new Discord.EmbedBuilder()
        .setTitle(question)
        .setDescription(`${answera} - ${votesA.toString()} hlasů\n${answerb} - ${votesB.toString()} hlasů`)
        .setColor("Random")
        .setFooter({text: `Hlasování končí za ${ms(ms(time), {long: true})}`})
        let mainmsg;
        ctx.channel.send({embeds: [mainembed], components: [row]}).then(msg => { mainmsg = msg})
        const collector = ctx.channel.createMessageComponentCollector({componentType: Discord.ComponentType.Button, time: ms(time)})
        const usersReacted = []
        collector.on("collect", i => {
            if (usersReacted.includes(i.user.id)) {
                const error = new Discord.EmbedBuilder()
                .setTitle("Už jsi již hlasoval")
                .setColor("Red")
                i.reply({embeds: [error], ephemeral: true})
            } else {
                usersReacted.push(i.user.id)
                const embed = new Discord.EmbedBuilder()
                .setTitle(question)
                .setFooter({text: `Hlasování končí za ${ms(ms(time), {long: true})}`})
                .setColor("Random")
                if (i.customId == "buttonA") {
                    votesA++
                    embed.setDescription(`${answera} - ${votesA.toString()} hlasů\n${answerb} - ${votesB.toString()} hlasů`)
                } else {
                    votesB++
                    embed.setDescription(`${answera} - ${votesA.toString()} hlasů\n${answerb} - ${votesB.toString()} hlasů`)
                }
                i.update({embeds: [embed], components: [row]})
            }
        })

        collector.on("end", i => {
            const newembed = new Discord.EmbedBuilder()
            .setTitle(question)
            .setDescription(`${answera} - ${votesA.toString()} hlasů\n${answerb} - ${votesB.toString()} hlasů`)
            .setColor("Red")
            .setFooter({text: `Hlasování skončilo`})
            row.components[0].setDisabled(true)
            row.components[1].setDisabled(true)
            mainmsg.edit({embeds: [newembed], components: [row]})
        })
    }
});