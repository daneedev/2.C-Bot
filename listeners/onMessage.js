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
        if (list.includes(message.content)) {
            message.reply("🙋🏿‍♂️")
        } else if (list2.includes(message.content)) {
            message.reply("👀")
        }
    }
});
