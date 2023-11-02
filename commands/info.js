const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const ms = require("ms")
const package = require("../package.json")
// Create a new command with the name 'hello'
new Command({
	name: 'info',
	description: 'Bot info',
	// GCommands Next offers different types of commands, we will only use slash and message commands here.
	type: [CommandType.SLASH, CommandType.MESSAGE],
	// The function thats executed when the user uses the command.
	run: (ctx) => {
        const uptime = ms(ctx.client.uptime, {long: true})
        const embed = new EmbedBuilder()
        .setTitle("Bot info")
        .addFields(
            {name: "Uptime", value: uptime, inline: true},
            {name: "Ping", value: `${ctx.client.ws.ping} ms`, inline: true},
            {name: "Version", value: package.version, inline: true},
            {name: "Node.js version", value: process.version, inline: true},
            {name: "Discord.js version", value: package.dependencies["discord.js"], inline: true},
            {name: "Author", value: "DaneeSkripter", inline: true},
        )
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
});