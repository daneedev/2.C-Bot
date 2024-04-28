const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const User = require("../models/User");


new Command({
	name: 'deleteallmydata', 
	description: 'Smaže všechna data, která o tobě bot má',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: async (ctx) => {
        const actionrow = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Ano")
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId("yes"),
            new Discord.ButtonBuilder()
            .setLabel("Ne")
            .setStyle(Discord.ButtonStyle.Danger)
            .setCustomId("no")
        )
        const user = await User.findOne({where: {discordId: ctx.user.id}})
        const embed = new EmbedBuilder()
        .setTitle("Opravdu chceš smazat všechna data?")
        .setDescription(`Zde jsou veškerá data, které o tobě bot má: <discordId: ${user.discordId}\npocetHlasek: ${user.pocetHlasek}\npocetZapisu: ${user.pocetZapisu}\npocetZprav: ${user.pocetZprav}\npocetSkull: ${user.pocetSkull}\nbirthday: ${user.birthday}\nbirthdayShowAge: ${user.birthdayShowAge}<`.replaceAll("<", "```"))
        .setColor("Red")
        ctx.reply({embeds: [embed], components: [actionrow], ephemeral: true})

        const buttonCollector = ctx.channel.createMessageComponentCollector({componentType: Discord.ComponentType.Button})
        buttonCollector.on("collect", async i => {
            if (i.customId === "yes") {
                await User.destroy({where: {discordId: ctx.user.id}})
                const embed = new EmbedBuilder()
                .setTitle("Data byla smazána")
                .setColor("Green")
                i.reply({embeds: [embed], ephemeral: true})
            } else {
                const embed = new EmbedBuilder()
                .setTitle("Data nebyla smazána")
                .setColor("Red")
                i.reply({embeds: [embed], ephemeral: true})
            }

        })
    }
});