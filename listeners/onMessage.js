const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
const fs = require("fs");


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
	run: (message) => {
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
        let messages = JSON.parse(fs.readFileSync(__dirname + "/../data/messages.json"))
        const oldmessage = messages.find(msg => msg.user === message.author.id)
        let obj;
        if (oldmessage) {
         messages = messages.filter(msg => msg.user !== message.author.id)
         obj = {
            user: message.author.id,
            count: oldmessage.count + 1
        }
        } else {
        obj = {
                user: message.author.id,
                count: 1
            }
        }
        messages.push(obj)
        fs.writeFileSync(__dirname + "/../data/messages.json", JSON.stringify(messages, null, 4))
    }
    }
});
