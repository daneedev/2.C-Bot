const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
const User = require("../models/User")


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
                findUser.save()
            } else {
                User.create({discordId: message.author.id, pocetHlasek: 0, pocetZapisu: 0, pocetZprav: 1})
            }
        }
    }
});
