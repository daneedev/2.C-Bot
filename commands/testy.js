const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")

new Command({
	name: 'testy',
	description: 'Napíše ti, jaké se budou zítra psát testy',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'datum',
            description: 'Datum, pro které chceš zjistit testy',
            type: ArgumentType.STRING,
            required: false
        })
    ],
	run: (ctx) => {
        const datum = ctx.arguments.getString("datum")
        const dnesniDate = new Date()
        const testy = JSON.parse(fs.readFileSync("./data/testy.json"))
        const dnesniDatum = `${dnesniDate.getDate()}.${dnesniDate.getMonth() + 1}.${dnesniDate.getFullYear()}`
        if (!datum) {
            const dnesniTesty = testy.filter((test) => test.datum == dnesniDatum)
            const dnesniTesty2 = testy.find((test) => test.datum == dnesniDatum)
            if (!dnesniTesty2) {
                const embed = new EmbedBuilder()
                .setTitle(`Dnešní testy`)
                .setDescription("Dnes se nekonají žádné testy")
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            } else {
                let testyString = ""
                dnesniTesty.forEach((test) => {
                    console.log(test.predmet)
                    testyString = `${testyString}\n**${test.predmet}**: ${test.tema}`
                })
                const embed = new EmbedBuilder()
                .setTitle(`Dnešní testy`)
                .setDescription(testyString)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            }
        } else {
            const testyDatum = testy.filter((test) => test.datum == datum)
            const testyDatum2 = testy.find((test) => test.datum == datum)
            if (!testyDatum2) {
                const embed = new EmbedBuilder()
                .setTitle(`Testy ${datum}`)
                .setDescription(`Dne ${datum} se nekonají žádné testy`)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            } else {
                let testyString = ""
                testyDatum.forEach((test) => {
                    testyString = `${testyString}\n**${test.predmet}**: ${test.tema}`
                })
                const embed = new EmbedBuilder()
                .setTitle(`Testy ${datum}`)
                .setDescription(testyString)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
            }
        }
    }
});
