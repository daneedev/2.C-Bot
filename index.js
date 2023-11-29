require('dotenv').config();
const { GClient, Plugins, Component, Command } = require('gcommands');
const { GatewayIntentBits } = require('discord.js');
const { join } = require('path');
const config = require("./config.json")
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
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], // !! IMPORTANT !! Uncomment these original intents before running in production
});

client.login(process.env.TOKEN);

