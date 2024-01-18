const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
let channels = require("../data/channels.json")
const fs = require("fs");
// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'ready',
	// Set the event to listen to
	event: 'ready',
	// The function thats called when the event occurs
	run: (client) => {
		const zaci = [
			"Vítka Adama", "Richarda Androsov", "Alisu Ataevu", "Vojtěcha Bendu", "Sebastiana Brože", "Vítka Chromce", "Magdalenu Dobešovou", "Jakuba Šejbu", "Bruna Fila", "Josefa Gondka", "Tadéáše Hrdinu", "Nataliu Ioninu",
			"Adama Jakeše", "Filipa Jozífa", "Filipa Kalistu", "Aleše Knapa", "Richarda Kobzu", "Štěpána Koudelku",
			"Daniela Kroufka", "Josefa Liegerta", "Vojtěcha Macha",
			"Kristinu Migel", "Vojtěcha Musila", "Robina Obleho 🙍🏿‍♂️", "Romana Paroubka", "Jaroslava Podhorného", "Lukáše Podhorného", "Nazariho Romanyuka", "Honzu Rožánka", "Marka Setikovského",
			"Otto Tejkla", "Martina Trinha", "Alberta Waage"
	]
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
