const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Hlaska = require("../models/Hlaska");

new Command({
	name: 'hlaska',
	description: 'Vypíše náhodnou hlášku',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: async (ctx) => {
        const hlasky = await Hlaska.findAll()
        const hlaska = hlasky[Math.floor(Math.random() * hlasky.length)]
        const channel = await ctx.guild.channels.fetch("1151842838695387166")
        const message = await channel.messages.fetch(hlaska.messageId)
        if (typeof(message.content) !== typeof("string")) {
            const embed = new EmbedBuilder()
            .setTitle("Chyba")
            .setDescription("Něco se pokazilo, zkuste to znovu")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else {
            const embed = new EmbedBuilder()
            .setTitle("Hláška")
            .setDescription(`Zde je náhodná hláška: \n${message.content}\n https://discord.com/channels/1138125239973314581/1151842838695387166/${message.id}`)
            .setColor("Random")
            ctx.reply({embeds: [embed]})
        }
    }
});