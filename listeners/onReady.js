const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'ready',
	// Set the event to listen to
	event: 'ready',
	// The function thats called when the event occurs
	run: (client) => {
		const zaci = [
		"Otto Tejkla", "Romana Paroubka", "Richarda Kobzu", "Vítka Adama", "Magdalenu Dobešovou", "Vojtěcha Bendu", "Bruna Fila", "Alberta Waage",
		"Adama Jakeše", "Jaroslava Podhorného", "Sebastiana Brože", "Lukáše Podhorného", "Martina Trinh", "Robina Oble", "Honzu Rožánka", "Alisu Ataevu",
		"Daniela Kroufka", "Aleše Knapa", "Josefa Gondka", "Marka Setikovského", "Tadéáše Hrdinu", "Richarda Androsov", "Filipa Jozífa", "Nataliu Ioninu",
		"Kristinu Migel", "Vojtěcha Musila", "Vojtěcha Macha", "Josefa Liegerta", "Jakuba Šejbu", "Filipa Kalistu", "Vítka Chromce", "Štěpána Koudelku"
	]
	client.user.setActivity(zaci[Math.floor(Math.random() * zaci.length)], {type: ActivityType.Watching})
		setInterval(function () {
			client.user.setActivity(zaci[Math.floor(Math.random() * zaci.length)], {type: ActivityType.Watching})
		}, 1000 * 60 * 60)
    }
});
