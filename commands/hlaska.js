const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs")
const User = require("../models/User")
const Hlaska = require("../models/Hlaska")


new Command({
	name: 'hlaska',
	description: 'Započítá hlášku do leaderboardu',
	type: [CommandType.CONTEXT_MESSAGE],
	run: async(ctx) => {
        const message = ctx.arguments.getMessage("message")
        const findHlaska = await Hlaska.findOne({where: {messageId: message.id}})
        if (message.channel.id !== "1174347873001943050") {
            const error = new EmbedBuilder()
            .setTitle("Tento příkaz lze použít pouze v kanálu #hlasky")
            .setColor("Red")
            ctx.reply({embeds: [error], ephemeral: true})
        } else if (findHlaska) { 
            const error = new EmbedBuilder()
            .setTitle("Tato hláška již byla zapsána")
            .setColor("Red")
            ctx.reply({embeds: [error], ephemeral: true})
        } else {
            const zapisovatel = message.author.id
            const autor = message.content.split(" - ")[1]
            if (!autor) {
                const error = new EmbedBuilder()
                .setTitle("Nesprávný formát hlášky")
                .setDescription("Hláška musí být ve formátu `<hláška> - <autor>`")
                .setColor("Red")
                ctx.reply({embeds: [error], ephemeral: true})
                return
            } else if (autor.includes("<@")) {
                const findAutor = await User.findOne({where: {discordId: autor.replace("<@", "").replace(">", "")}})
                if (findAutor) {
                    findAutor.pocetHlasek += 1
                    findAutor.save()
                } else {
                    User.create({discordId: autor.replace("<@", "").replace(">", ""), pocetHlasek: 1, pocetZapisu: 0, pocetZprav: 0})
                }
            } else {
                const findAutor = await User.findOne({where: {name: autor}})
                if (findAutor) {
                    findAutor.pocetHlasek += 1
                    findAutor.save()
                } else {
                    User.create({name: autor, pocetHlasek: 1, pocetZapisu: 0, pocetZprav: 0})
                }
            }
            const findZapisovatel = await User.findOne({where: {discordId: zapisovatel}})
            if (findZapisovatel) {
                findZapisovatel.pocetZapisu += 1
                findZapisovatel.save()
            } else {
                User.create({discordId: zapisovatel, pocetHlasek: 0, pocetZapisu: 1, pocetZprav: 0})
            }
            Hlaska.create({messageId: message.id})
            const success = new EmbedBuilder()
            .setTitle("Hláška byla úspěšně zapsána")
            .setColor("Green")
            ctx.reply({embeds: [success], ephemeral: true})
        } 
    }
});