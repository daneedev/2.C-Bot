const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")
const Test = require("../models/Test")
const subjects = require("../data/subjects.json")
const groups = require("../data/groups.json")

new Command({
	name: 'pridattest',
	description: 'Přidá test na dané datum do databáze',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'den',
            description: 'Den, pro které chceš přidat test',
            type: ArgumentType.INTEGER,
            required: true
        }),
        new Argument({
            name: 'mesic',
            description: 'Měsíc, pro které chceš přidat test',
            type: ArgumentType.INTEGER,
            required: true
        }),
        new Argument({
            name: "tema",
            description: "Téma testu",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "predmet",
            description: "Předmět testu",
            type: ArgumentType.STRING,
            required: true,
            choices: subjects
        }),
        new Argument({
            name: "skupina",
            description: "Skupina předmětu",
            type: ArgumentType.STRING,
            required: true,
            run: (ctx) => {
                const predmet = ctx.interaction.options.getString("predmet")
                const skupiny = groups.find(group => group.subject === predmet)
                if (!skupiny) {
                    ctx.respond([
                        {name: "SK1", value: "SK1"},
                        {name: "SK2", value: "SK2"},
                        {name: "Celá třída", value: ""},
                    ])
                } else {
                    ctx.respond(skupiny.groups)
                }
            }
        })
    ],
	run: (ctx) => {
        const den = ctx.arguments.getInteger("den")
        const mesic = ctx.arguments.getInteger("mesic")
        const tema = ctx.arguments.getString("tema")
        const predmet = ctx.arguments.getString("predmet")
        if (mesic > 12) {
            const embed = new EmbedBuilder()
            .setTitle("Chyba")
            .setDescription("Zadal jsi neplatný měsíc")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else if (den > 31) {
            const embed = new EmbedBuilder()
            .setTitle("Chyba")
            .setDescription("Zadal jsi neplatný den")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else {
        Test.create({den: den, mesic: mesic, predmet: predmet, tema: tema, skupina: ctx.arguments.getString("skupina")})
        const embed = new EmbedBuilder()
        .setTitle("Test přidán!")
        .setColor("Green")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
    }
});
