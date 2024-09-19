const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")
const Test = require("../models/Test")
const dayjs = require('dayjs')

new Command({
	name: 'testy',
	description: 'Napíše ti, jaké se budou zítra psát testy',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'den',
            description: 'Den, pro které chceš zjistit testy',
            type: ArgumentType.INTEGER,
            required: false
        }),
        new Argument({
            name: 'mesic',
            description: 'Měsíc, pro které chceš zjistit testy',
            type: ArgumentType.INTEGER,
            required: false
        })
    ],
	run: async (ctx) => {
        const den = ctx.arguments.getInteger("den")
        const mesic = ctx.arguments.getInteger("mesic")
        const zitraDate = dayjs().add(1, 'day')
        const zitraDen = zitraDate.date()
        const zitraMesic = zitraDate.month() + 1
        console.log(zitraDen, zitraMesic)
        if (!den && !mesic) {
            const zitraTesty = await Test.findAll({where: {den: zitraDen, mesic: zitraMesic}})
            if (!zitraTesty.length >= 1) {
                const embed = new EmbedBuilder()
                .setTitle(`Zítřejší testy`)
                .setDescription("Zítra se nekonají žádné testy")
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            } else {
                let testyString = ""
                zitraTesty.forEach((test) => {
                    if (test.skupina === "") { 
                        testyString = `${testyString}\n**${test.predmet}**: ${test.tema}`
                    } else {
                        testyString = `${testyString}\n**${test.predmet}** - *${test.skupina}*: ${test.tema}`
                    }
                })
                const embed = new EmbedBuilder()
                .setTitle(`Zítřejší testy`)
                .setDescription(testyString)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
        }
        } else {
            if (mesic > 12 || den > 31 || mesic <= 0 || den <= 0) {
                const embed = new EmbedBuilder()
                .setTitle("Chyba")
                .setDescription("Zadal jsi neplatný datum")
                .setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
            } else {
            const testyDatum = await Test.findAll({where: {den: den, mesic: mesic}})
            if (!testyDatum.length >= 1) {
                const embed = new EmbedBuilder()
                .setTitle(`Testy ${den}.${mesic}`)
                .setDescription(`Dne ${den}.${mesic} se nekonají žádné testy`)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            } else {
                let testyString = ""
                testyDatum.forEach((test) => {
                    if (test.skupina === "") { 
                        testyString = `${testyString}\n**${test.predmet}**: ${test.tema}`
                    } else {
                        testyString = `${testyString}\n**${test.predmet}** - *${test.skupina}*: ${test.tema}`
                    }
                })
                const embed = new EmbedBuilder()
                .setTitle(`Testy ${den}.${mesic}`)
                .setDescription(testyString)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            }
        }
        }
    }
});
