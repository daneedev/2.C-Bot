const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")

new Command({
	name: 'pridattest',
	description: 'Přidá test na dané datum do databáze',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'datum',
            description: 'Datum, pro které chceš přidat test',
            type: ArgumentType.STRING,
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
        const datum = ctx.arguments.getString("datum")
        const tema = ctx.arguments.getString("tema")
        const predmet = ctx.arguments.getString("predmet")
        const test = {
            datum: datum,
            tema: tema,
            predmet: predmet
        }
        const testy = JSON.parse(fs.readFileSync("./data/testy.json"))
        testy.push(test)
        fs.writeFileSync("./data/testy.json", JSON.stringify(testy, null, 4))
        ctx.reply("test")
    }
});
