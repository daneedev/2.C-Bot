const { Listener } = require('gcommands');
const { ActivityType } = require("discord.js")
let channels = require("../data/channels.json")
const fs = require("fs");
const dayjs = require('dayjs');
const Discord = require('discord.js')
const getProgressbar = require("../handlers/progress")
const User = require('../models/User')
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
				let max = 0
				options.forEach(option => max += option.votes)
				options.forEach(option => {
					text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
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
						let max = 0
						options.forEach(option => max += option.votes)
						options.forEach(option => {
							text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
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
					let max = 0
					options.forEach(option => max += option.votes)
					options.forEach(option => {
						text += `__**${option.name} - ${option.votes} hlasů**__\n **${getProgressbar(option.votes, max)}**\n`
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

		// NAROZENINY
		const sent = []
		setInterval(async () => {
			const users = await User.findAll()
			users.forEach(user => {
				const birthday = user.birthday
				if (birthday === null) return
				if (sent.includes(user.discordId)) return
				const date = birthday.split(".")
				const day = date[0]
				const month = date[1]
				const year = date[2]
				if (dayjs().format("DD") === day && dayjs().format("MM") === month && dayjs().hour() > 8) {
					let description = `Dnes má narozeniny <@${user.discordId}>!`
					if (user.birthdayShowAge) {
						description = `Dnes má <@${user.discordId}> své ${dayjs().year() - year}. narozeniny!`
					}
					const channel = client.channels.cache.get("1148526800138416230")
					const embed = new Discord.EmbedBuilder()
					.setTitle("🎉 Vše nejlepší 🎉")
					.setDescription(description)
					.setColor("Random")
					channel.send({embeds: [embed]}).then((m) => {
						m.react("🎉")
					})
					sent.push(user.discordId)
				}
			})
		}, 60000)


		// IN GAME RESET
		const inGameUsers = await User.findAll({where: {inGame: true}})
		inGameUsers.forEach(user => {
			user.inGame = false
			user.save()
		})
    }
});