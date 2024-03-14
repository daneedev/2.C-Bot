const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require('discord.js')
const ms = require('ms')
const dayjs = require('dayjs');
const Hlasovani = require('../models/Hlasovani');
const getProgressbar = require("../handlers/progress")

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
            name: 'options',
            description: 'Odpovědi (oddělujte čárkou)',
            type: ArgumentType.STRING,
            required: true
        }),
    ],
	run: async (ctx) => {
    const question = ctx.arguments.getString('question')
    const time = ctx.arguments.getString('time')
    let optionsraw = ctx.arguments.getString('options')
    const errorembed = new Discord.EmbedBuilder()
    .setColor("Red")
    if (time < 60000) {
        errorembed.setTitle("Čas musí být alespoň 1 minuta")
        return ctx.reply({embeds: [errorembed], ephemeral: true})
    }
    if (!optionsraw.includes(",")) {
        errorembed.setTitle("Musíš zadat alespoň 2 možnosti")
        return ctx.reply({embeds: [errorembed], ephemeral: true})
    }
    optionsraw = optionsraw.split(",")
    if (optionsraw.length > 25) {
        errorembed.setTitle("Nemůžeš mít víc než 25 možností")
        return ctx.reply({embeds: [errorembed], ephemeral: true})
    }
    let options = []
    let date;
    const usersReacted = []
    let actionrows = []
    if (optionsraw.length > 5) {
        const actionrownumber = Math.ceil(optionsraw.length / 5) 
        for (let i = 0; i < actionrownumber; i++) {   
            const actionrow = new Discord.ActionRowBuilder()
            let length = 5
            if (optionsraw.length < 5) {
                length = optionsraw.length
            }
        for (let j = 0; j < length; j++) {
                options.push({
                    name: optionsraw[j],
                    votes: 0
                })
                const button = new Discord.ButtonBuilder()
                .setCustomId(optionsraw[j])
                .setLabel(optionsraw[j])
                .setStyle(Discord.ButtonStyle.Primary)
                actionrow.addComponents(button)
        }
        optionsraw = optionsraw.slice(5)
        actionrows.push(actionrow)
    }
    } else {
        const actionrow = new Discord.ActionRowBuilder()
        optionsraw.forEach(option => {
            options.push({
                name: option,
                votes: 0
            })
            const button = new Discord.ButtonBuilder()
            .setCustomId(option)
            .setLabel(option)
            .setStyle(Discord.ButtonStyle.Primary)
            actionrow.addComponents(button)
        })
        actionrows.push(actionrow)
    }

    let text = ""
    let max = 0
    options.forEach(option => max += option.votes)
    options.forEach(option => {
        text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
    })
    date = dayjs().add(ms(time), 'ms').unix()
    text += `\n\nKonec: <t:${date}:R>`
    const embed = new Discord.EmbedBuilder()
    .setTitle(question)
    .setDescription(text)
    .setColor("Random")
    let mainmsg;
    ctx.channel.send({embeds: [embed], components: actionrows}).then((msg) => {
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
        const reply = new Discord.EmbedBuilder()
        .setTitle("Hlasování bylo vytvořeno")
        .setColor("Green")
        ctx.reply({embeds: [reply], ephemeral: true})
    }).catch((err) => {
        const reply = new Discord.EmbedBuilder()
        .setTitle("Nelze vytvořit hlasování")
        .setColor("Red")
        ctx.reply({embeds: [reply], ephemeral: true})
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
            let max = 0
            options.forEach(option => max += option.votes)
            options.forEach(option => {
                text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
            })
            text += `\n\nKonec: <t:${date}:R>`
            const update = new Discord.EmbedBuilder()
            .setTitle(question)
            .setDescription(text)
            .setColor("Random")
            i.message.edit({embeds: [update], components: i.message.components})
            const hlasovani = await Hlasovani.findOne({where: {messageId: i.message.id}})
            hlasovani.options = options
            hlasovani.usersReacted = usersReacted
            hlasovani.save()
        }
    })
    
    buttonCollector.on("end", async i => {
        let endactionrows = []
        mainmsg.components.forEach(row => {
            const endactionrow = new Discord.ActionRowBuilder()
            row.components.forEach(component => {
            component.data.disabled = true
            endactionrow.addComponents(component)
            })
            endactionrows.push(endactionrow)
        })
        text = ""
        let max = 0
        options.forEach(option => max += option.votes)
        options.forEach(option => {
            text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
        })
        text += `\n\nHlasování skončilo: <t:${date}:R>`
        const update = new Discord.EmbedBuilder()
        .setTitle(question)
        .setDescription(text)
        .setColor("Red")
        mainmsg.edit({embeds: [update], components: endactionrows})
        const hlasovani = await Hlasovani.findOne({where:{messageId: mainmsg.id}})
        hlasovani.finished = true
        hlasovani.save()
    })

}
});