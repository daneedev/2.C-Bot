const { Listener } = require('gcommands');
const User = require("../models/User")
const Hlaska = require("../models/Hlaska")

new Listener({
    name: 'editMessage',
    event: 'messageUpdate',
    run: async (client, newMessage, oldMessage) => {
        if (newMessage.channel.id === process.env.HLASKY_CHANNEL_ID) {
            const zapisovatel = newMessage.author.id
            if (newMessage.author.bot) return
            let autor = newMessage.content.split(" - ")[1]
            if (autor && autor.includes(" ")) autor = autor.split(" ")[0]
            if (await Hlaska.findOne({where: {messageId: newMessage.id}})) return
            if (!autor) {
                return
            } else if (autor.startsWith("<@") && autor.endsWith(">")) {
                const findAutor = await User.findOne({where: {discordId: autor.replace("<@", "").replace(">", "")}})
                if (findAutor) {
                    findAutor.pocetHlasek += 1
                    findAutor.save()
                } else {
                    User.create({discordId: autor.replace("<@", "").replace(">", ""), pocetHlasek: 1, pocetZapisu: 0, pocetZprav: 0, pocetSkull: 0, cash: 0, bank: 0})
                }
            } else {
                const findAutor = await User.findOne({where: {name: autor}})
                if (findAutor) {
                    findAutor.pocetHlasek += 1
                    findAutor.save()
                } else {
                    User.create({name: autor, pocetHlasek: 1, pocetZapisu: 0, pocetZprav: 0, pocetSkull: 0, cash: 0, bank: 0})
                }
            }
            const findZapisovatel = await User.findOne({where: {discordId: zapisovatel}})
            if (findZapisovatel) {
                findZapisovatel.pocetZapisu += 1
                findZapisovatel.save()
            } else {
                User.create({discordId: zapisovatel, pocetHlasek: 0, pocetZapisu: 1, pocetZprav: 0, pocetSkull: 0, cash: 0, bank: 0})
            }
            Hlaska.create({messageId: newMessage.id})
            newMessage.react("👍")
        }
    }
})