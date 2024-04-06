const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
const User = require("../models/User")
const Hlaska = require("../models/Hlaska")
const { EmbedBuilder } = require('discord.js');

function countSpecialCharacters(inputString) {
    const specialCharacters = [".", ",", "á", "é", "í", "ó", "ů", "ú", "ž", "š", "č", "ř", "ď", "ť", "ň", "ě"];
    let totalCount = 0;

    for (let i = 0; i < inputString.length; i++) {
    specialCharacters.forEach((char) => {
        if (inputString[i] == char) {
            totalCount++;
        } 
    })
}
    return totalCount;
  }

// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'message',
	// Set the event to listen to
	event: 'messageCreate',
	// The function thats called when the event occurs
	run: async (message) => {
        const list = ["negr", "nigger", "nigga", "cernoch"]
        const list2 = ["uwu", "oniichan", "onichan", "mnau", "sablo", "sablik", "siblik"]
        const list3 = ["cinan", "vietnamec", "japonec", "zluty", "cingcong", "ching chong"]
        const list4 = ["arch", "neumim", "nevim", "co to je", "💀", "ubuntu", "well actually", "🤓"]
        const list5 = ["lacina", "kalista", "inneman", "tesar", "slovak", "networkchuck", "lada", "nepomucky", "cisco", "github"]
        list.forEach((item) => {
            if (message.content.toLowerCase().normalize("NFD").includes(item)) {
                message.react("🙋🏿‍♂️")
            }
        })
        list2.forEach((item) => {
            if (message.content.toLowerCase().normalize("NFD").includes(item)) {
                message.react("👀")
            }
        })
        list3.forEach((item) => {
            if (message.content.toLowerCase().normalize("NFD").includes(item)) {
                message.react("🍚")
            }
        })
        list4.forEach((item) => {
            if (message.content.toLowerCase().normalize("NFD").includes(item)) {
                message.react("💀")
            }
        })
        list5.forEach((item) => {
            if (message.content.toLowerCase().normalize("NFD").includes(item)) {
                message.react("❤️")
            }
        })
        let count = countSpecialCharacters(message.content)
        if (count > 15) {
            message.react("💀")
        }
        
        if (!message.author.bot) {
            const findUser = await User.findOne({where: {discordId: message.author.id}})
            if (findUser) {
                findUser.pocetZprav += 1
                const matches = message.content.match(/💀/g) 
                matches ? findUser.pocetSkull += matches.length : 0
                findUser.save()
            } else {
                User.create({discordId: message.author.id, pocetHlasek: 0, pocetZapisu: 0, pocetZprav: 1, pocetSkull: 0})
            }
        }

        // HLASKA LEADERBOARD
        if (message.channel.id === process.env.HLASKY_CHANNEL_ID) {
            const zapisovatel = message.author.id
            if (message.author.bot) return
            let autor = message.content.split(" - ")[1]
            if (autor && autor.includes(" ")) autor = autor.split(" ")[0]
            if (!autor) {
                return
            } else if (autor.startsWith("<@") && autor.endsWith(">")) {
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
            message.react("👍")
        }
    }
});
