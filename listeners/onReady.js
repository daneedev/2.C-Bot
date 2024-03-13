const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
let channels = require("../data/channels.json")
const fs = require("fs");
const dayjs = require('dayjs');
const Discord = require('discord.js')
// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'ready',
	// Set the event to listen to
	event: 'ready',
	// The function thats called when the event occurs
	run: async (client) => {
	/*const zaci = require("../data/names.json")
	let i = 0;
	client.user.setActivity(zaci[i], {type: ActivityType.Watching})
		setInterval(function () {
			i++
			if (i === zaci.length) {
				i = 0
			}
			client.user.setActivity(zaci[i], {type: ActivityType.Watching})
		}, 1000 * 60 * 60)*/
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
		// HLASOVANI
		const Hlasovani = require("../models/Hlasovani")
		const hlasovani = await Hlasovani.findAll({where: {finished: false}})
		hlasovani.forEach(async (h) => {
			const message = await client.channels.cache.get(h.channelId).messages.fetch(h.messageId)
			if (h.time < dayjs().unix()) {
				let endactionrows = []
				message.components.forEach(row => {
					const endactionrow = new Discord.ActionRowBuilder()
					row.components.forEach(component => {
					component.data.disabled = true
					endactionrow.addComponents(component)
					})
					endactionrows.push(endactionrow)
				})
				const options = h.options
				let text = ""
				options.forEach(option => {
					text += `${option.name} - ${option.votes} hlasů\n`
				})
				text += `\n\nHlasování skončilo: <t:${h.time}:R>`
				const embed = new Discord.EmbedBuilder()
				.setTitle(h.question)
				.setDescription(text)
				.setColor("Red")
				message.edit({embeds: [embed], components: endactionrows})
				h.finished = true
				h.save()
			} else {
				const timeleft = h.time - dayjs().unix()
				const collector = message.createMessageComponentCollector({componentType: Discord.ComponentType.Button, time: timeleft * 1000})

				collector.on("collect", async i => {
					if (h.usersReacted.includes(i.user.id)) {
						return i.reply({content: "Už jsi hlasoval", ephemeral: true})
					} else {
						const hlasovani2 = await Hlasovani.findOne({where: {messageId: i.message.id}})
						let options = hlasovani2.options
						const option = options.find(option => option.name === i.customId)
						option.votes++
						options = options.filter(option => option.name !== i.customId)
						options.push(option)
						options.sort((a, b) => b.votes - a.votes)
						h.usersReacted.push(i.user.id)
						i.reply({content: "Hlasováno", ephemeral: true})
						text = ""
						options.forEach(option => {
							text += `${option.name} - ${option.votes} hlasů\n`
						})
						text += `\n\nKonec: <t:${h.time}:R>`
						
						let actionrows = []
						message.components.forEach(row => {
						const actionrow = new Discord.ActionRowBuilder()
							row.components.forEach(component => {
								actionrow.addComponents(component)
							})
						actionrows.push(actionrow)
						})
						const update = new Discord.EmbedBuilder()
						.setTitle(h.question)
						.setDescription(text)
						.setColor("Random")
						i.message.edit({embeds: [update], components: actionrows})
						h.options = options
						h.save()
					}
				})

				collector.on("end", async i => {
					let endactionrows = []
					message.components.forEach(row => {
						const endactionrow = new Discord.ActionRowBuilder()
						row.components.forEach(component => {
						component.data.disabled = true
						endactionrow.addComponents(component)
						})
						endactionrows.push(endactionrow)
					})
					text = ""
					const options = h.options
					options.forEach(option => {
						text += `${option.name} - ${option.votes} hlasů\n`
					})
					text += `\n\nHlasování skončilo: <t:${h.time}:R>`
					const update = new Discord.EmbedBuilder()
					.setTitle(h.question)
					.setDescription(text)
					.setColor("Red")
					message.edit({embeds: [update], components: endactionrows})
					h.finished = true
					h.save()
				})
			}
		})
    }
});