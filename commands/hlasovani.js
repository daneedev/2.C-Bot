const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require('discord.js')
const ms = require('ms')
const dayjs = require('dayjs');
const Hlasovani = require('../models/Hlasovani');

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
            name: 'time',
            description: 'Čas na zodpovězení otázky',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'number',
            description: 'Počet odpovědí',
            type: ArgumentType.INTEGER,
            required: true
        }),
    ],
	run: async (ctx) => {
    const question = ctx.arguments.getString('question')
    const time = ctx.arguments.getString('time')
    const number = ctx.arguments.getInteger('number')
    if (time < 60000) {
        return ctx.reply("Čas musí být alespoň 1 minuta")
    }
    const filter = m => m.author.id === ctx.user.id
        if (number <=0) {
            m.reply({content: "Tohle není číslo", ephemeral: true})
            return
        } else {
            let options = []
            const actionrow = new Discord.ActionRowBuilder()
            const usersReacted = []
            let i = 1;
            let date;
            const option = new Discord.EmbedBuilder()
            .setTitle(`Napiš odpověď číslo ${i}`)
            .setFooter({text: "Na zodpovězení otázky máš 1 minutu"})
            .setColor("Random")
            await ctx.channel.send({embeds: [option]})
            
            const optionCollector = ctx.channel.createMessageCollector({ filter, time: 60000 });

            optionCollector.on("collect", async (msg) => {
                options.push({
                    name: msg.content,
                    votes: 0
                })
                const button = new Discord.ButtonBuilder()
                .setCustomId(msg.content)
                .setLabel(msg.content)
                .setStyle(Discord.ButtonStyle.Primary)
                optionCollector.resetTimer()
                i++
                actionrow.addComponents(button)
                if (i > number) { return optionCollector.stop("next") }
                option.setTitle(`Napiš odpověď číslo ${i}`)
                await ctx.channel.send({embeds: [option]})
            })

            optionCollector.on("end", async (collected, reason) => {
                if (reason !== "next") {
                    const timeexpired = new Discord.EmbedBuilder()
                    .setTitle("Čas vypršel")
                    .setColor("Red")
                    await ctx.channel.send({embeds: [timeexpired]})
                } else {
                    let text = ""
                    options.forEach(option => {
                        text += `${option.name} - ${option.votes} hlasů\n`
                    })
                    date = dayjs().add(ms(time), 'ms').unix()
                    text += `\n\nKonec: <t:${date}:R>`
                    const embed = new Discord.EmbedBuilder()
                    .setTitle(question)
                    .setDescription(text)
                    .setColor("Random")
                    let mainmsg;
                    ctx.channel.send({embeds: [embed], components: [actionrow]}).then((msg) => {
                        Hlasovani.create({
                            messageId: msg.id,
                            channelId: ctx.channel.id,
                            options: options,
                            finished: false,
                            time: date,
                            question: question,
                            usersReacted: usersReacted
                        })
                        mainmsg = msg
                    })

                    // BUTTON COLLECTOR
                    const buttonCollector = ctx.channel.createMessageComponentCollector({componentType: Discord.ComponentType.Button, time: ms(time)})
                     date = dayjs().add(ms(time), 'ms').unix()

                    buttonCollector.on("collect", async i => {
                        if (usersReacted.includes(i.user.id)) {
                            return i.reply({content: "Už jsi hlasoval", ephemeral: true})
                        } else {
                            const option = options.find(option => option.name === i.customId)
                            option.votes++
                            options = options.filter(option => option.name !== i.customId)
                            options.push(option)
                            options.sort((a, b) => b.votes - a.votes)
                            usersReacted.push(i.user.id)
                            i.reply({content: "Hlasováno", ephemeral: true})
                            text = ""
                            options.forEach(option => {
                                text += `${option.name} - ${option.votes} hlasů\n`
                            })
                            text += `\n\nKonec: <t:${date}:R>`
                            const update = new Discord.EmbedBuilder()
                            .setTitle(question)
                            .setDescription(text)
                            .setColor("Random")
                            i.message.edit({embeds: [update], components: [actionrow]})
                            const hlasovani = await Hlasovani.findOne({where: {messageId: i.message.id}})
                            hlasovani.options = options
                            hlasovani.usersReacted = usersReacted
                            hlasovani.save()
                        }
                    })
                    
                    buttonCollector.on("end", async i => {
                        const endactionrow = new Discord.ActionRowBuilder()
                        actionrow.components.forEach(component => {
                            component.setDisabled(true)
                            endactionrow.addComponents(component)
                        })
                        text = ""
                        options.forEach(option => {
                            text += `${option.name} - ${option.votes} hlasů\n`
                        })
                        text += `\n\nHlasování skončilo: <t:${date}:R>`
                        const update = new Discord.EmbedBuilder()
                        .setTitle(question)
                        .setDescription(text)
                        .setColor("Red")
                        mainmsg.edit({embeds: [update], components: [endactionrow]})
                        const hlasovani = await Hlasovani.findOne({where:{messageId: mainmsg.id}})
                        hlasovani.finished = true
                        hlasovani.save()
                    })
                }
            })
}

}
});