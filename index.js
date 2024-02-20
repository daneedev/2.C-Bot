require('dotenv').config();
const { GClient, Plugins, Component, Command } = require('gcommands');
const { GatewayIntentBits } = require('discord.js');
const { join } = require('path');
const sequelize = require('./database');

// SYNC DB
sequelize.sync().then(() => console.log("Database is ready!"))

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
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], // !! IMPORTANT !! Uncomment these original intents before running in production
});

client.login(process.env.TOKEN);

