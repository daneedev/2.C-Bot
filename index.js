require('dotenv').config();
const { GClient, Plugins, Component, Command } = require('gcommands');
const { GatewayIntentBits } = require('discord.js');
const { join } = require('path');
const config = require("./config.json")
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB, {
}).then(() =>[
  console.log("Connected to the database!")
]).catch((err) =>{
  console.log('Failed connect to the database!')
})
Component.setDefaults({
	onError: (ctx, error) => {
		return ctx.reply('Oops! Something went wrong')
	} 
});


Plugins.search(__dirname);

const client = new GClient({
	dirs: [
		join(__dirname, 'commands'),
		join(__dirname, 'components'),
		join(__dirname, 'listeners')
	],
	messageSupport: false,
	devGuildId: process.env.DEV_SERVER,
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.login(process.env.TOKEN);

