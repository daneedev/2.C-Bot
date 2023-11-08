const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'qrcode',
	description: 'Vygeneruje ti QR kód',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "data",
            description: "Data, které chceš do QR kódu uložit",
            required: true,
            type: ArgumentType.STRING
        })
    ],
	run: (ctx) => {
        const data = ctx.arguments.getString("data")
        const embed = new EmbedBuilder()
        .setTitle("QR kód")
        .setDescription("Zde je tvůj QR kód")
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data.replaceAll(" ", "%20")}`)
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});