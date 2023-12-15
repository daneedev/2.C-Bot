const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const config = require("../config.json")
// Create a new command with the name 'hello'
new Command({
	name: 'obedy',
	description: 'Napíše ti dnešní obědy',
	// GCommands Next offers different types of commands, we will only use slash and message commands here.
	type: [CommandType.SLASH, CommandType.MESSAGE],
	cooldown: "10s",
	// The function thats executed when the user uses the command.
	run: (ctx) => {
		if (ctx.channel.id != "1138207425263059097") {
			const errorembed = new EmbedBuilder()
			.setColor("Red")
			.setDescription("Tento příkaz můžeš použít pouze v kanálu <#1138207425263059097>!")
			ctx.reply({embeds: [errorembed], ephemeral: true})
		} else {
			fetch("https://app.strava.cz/api/jidelnicky", {
				"body": `{\"cislo\":\"${config.jidelnaID}\",\"s5url\":\"https://wss5.strava.cz/WSStravne5_5/WSStravne5.svc\",\"lang\":\"CZ\",\"ignoreCert\":false}`,
				"method": "POST"
				}).then(response => response.json()).then(data => {
				const datum = data[`table0`].find(meal => meal.druh_popis == "Polévka ").datum
				const polevka = data[`table0`].find(meal => meal.druh_popis == "Polévka ").nazev
				const obed1 = data[`table0`].find(meal => meal.druh_popis == "Oběd 1 ").nazev
				const obed2 = data[`table0`].find(meal => meal.druh_popis == "Oběd 2 ").nazev
				const embed = new EmbedBuilder()
				embed.setTitle(`Obědy ${datum}`)
				embed.setDescription(`**🍲 Polévka:** ${polevka}\n**🍕 Oběd 1:** ${obed1}\n**🍔 Oběd 2:** ${obed2}`)
				embed.setColor("Random")
				ctx.reply({embeds: [embed]})
			})
	}
	}
});