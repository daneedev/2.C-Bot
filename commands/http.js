const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'httperror', 
	description: 'Zobrazí ti http error',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "errorcode",
            description: "Error code",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
	run: (ctx) => {
        const errorcode = ctx.arguments.getInteger("errorcode")
        if (errorcode > 599 || errorcode < 100) {
            const error = new EmbedBuilder()
            .setTitle("Error code musí být mezi 100 a 599")
            .setColor("Red")
            ctx.reply({embeds: [error], ephemeral: true})
        } else {
        const embed = new EmbedBuilder()
        .setTitle(`Error ${errorcode}`)
        .setImage(`https://http.cat/${errorcode}.jpg`)
        .setColor("Random")
        ctx.reply({embeds: [embed]})
        }
    }
});