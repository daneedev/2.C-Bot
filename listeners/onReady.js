const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
let channels = require("../data/channels.json")
const fs = require("fs");
const names = 
// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'ready',
	// Set the event to listen to
	event: 'ready',
	// The function thats called when the event occurs
	run: (client) => {
	const zaci = require("../data/names.json")
	let i = 0;
	client.user.setActivity(zaci[i], {type: ActivityType.Watching})
		setInterval(function () {
			i++
			if (i === zaci.length) {
				i = 0
			}
			client.user.setActivity(zaci[i], {type: ActivityType.Watching})
		}, 1000 * 60 * 60)
		// TEMP CHANNELS
		channels.forEach((c) => {
			const findChannel = client.channels.cache.get(c.id)
			if (findChannel && findChannel.members.size === 0) {
				findChannel.delete()
				channels = channels.filter(c => c.id !== findChannel.id)
				fs.writeFile(__dirname + "/../data/channels.json", JSON.stringify(channels), (err) => {
				if (err) console.log(err)
			})
			}
		})
    }
});
