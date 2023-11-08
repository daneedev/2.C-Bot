const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'message',
	// Set the event to listen to
	event: 'messageCreate',
	// The function thats called when the event occurs
	run: (message) => {
        const list = ["negr", "nigger", "nigga", "cernoch"]
        const list2 = ["uwu", "oniichan", "onichan", "mnau", "sablo", "sablik"]
        const list3 = ["cinan", "vietnamec", "japonec", "zluty", "cingcong", "ching chong"]
        list.forEach((item) => {
            if (message.content.includes(item)) {
                message.reply("🙋🏿‍♂️")
            }
        })
        list2.forEach((item) => {
            if (message.content.includes(item)) {
                message.reply("👀")
            }
        })
        list3.forEach((item) => {
            if (message.content.includes(item)) {
                message.reply("🍚")
            }
        })
        if (list.includes(message.content)) {
            message.reply("🙋🏿‍♂️")
        } else if (list2.includes(message.content)) {
        }
    }
});
