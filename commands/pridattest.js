const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")
const Test = require("../models/Test")

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
            choices: [
                {
                    name: "Český jazyk",
                    value: "Český jazyk"
                },
                {
                    name: "Anglický jazyk (SK Přech)",
                    value: "Anglický jazyk (SK Přech)",
                },
                {
                    name: "Anglický jazyk (SK Vlasová)",
                    value: "Anglický jazyk (SK Vlasová)"
                },
                {
                    name: "Matematika",
                    value: "Matematika"
                },
                {
                    name: "Fyzika",
                    value: "Fyzika"
                },
                {
                    name: "Dějepis",
                    value: "Dějepis"
                },
                {
                    name: "Chemie-ekologie",
                    value: "Chemie-ekologie"
                },
                {
                    name: "Elektrotechnika",
                    value: "Elektrotechnika"
                },
                {
                    name: "Počítačové sítě",
                    value: "Počítačové sítě"
                },
                {
                    name: "Hardware",
                    value: "Hardware"
                },
                {
                    name: "Technické kreslení",
                    value: "Technické kreslení"
                },
                {
                    name: "Programování a vývoj aplikací",
                    value: "Programování a vývoj aplikací"
                },
                {
                    name: "Praktické cvičení",
                    value: "Praktické cvičení"
                },
                {
                    name: "Prezentační dovednosti",
                    value: "Prezentační dovednosti" 
                }
            ]
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
        Test.create({den: den, mesic: mesic, predmet: predmet, tema: tema})
        const embed = new EmbedBuilder()
        .setTitle("Test přidán!")
        .setColor("Green")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
    }
});
