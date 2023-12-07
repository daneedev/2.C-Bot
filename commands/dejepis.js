const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js')

const DESCRIPTION = "Odpovědi na všechny otázky z dějepisu"

async function runCommand(ctx) {
    const embed = new EmbedBuilder()
    .setTitle("Dějepis")
    .setDescription("Na této stránce najdeš všechny odpovědi: https://cernyrob.in/kafka")
    .setColor("Random")
    ctx.reply({embeds: [embed], ephemeral: true})
}

new Command({
    name: 'dejepis',
    description: DESCRIPTION,
    type: [CommandType.SLASH, CommandType.MESSAGE],
    run: runCommand
})

new Command({
    name: 'kafka',
    description: DESCRIPTION,
    type: [CommandType.SLASH, CommandType.MESSAGE],
    run: runCommand
})