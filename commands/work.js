const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')

new Command({
	name: 'work',
	description: 'Pracuj a vydělej si peníze',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    cooldown: "1h",
	run: async (ctx) => {
        const jobs = [
            "Učitel",
            "Lékař",
            "Programátor",
            "Kuchař",
            "Číšník",
            "Řidič",
            "Prodavač",
            "Policista",
            "Hasič",
            "Zahradník",
            "Mechanik",
            "Elektrikář",
            "Instalatér",
            "Kadeřník",
            "Discord mod"
        ];
        const user = await User.findOne({where: {discordId: ctx.user.id}})
        const cash = Math.floor(Math.random() * 300)
        user.cash += cash
        user.save()
        const embed = new EmbedBuilder()
        .setTitle("Práce")
        .setDescription(`Pracoval si hodinu jako ${jobs[Math.floor(Math.random() * jobs.length)]} a vydělal sis ${commaNumber(cash)} Kč`)
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});
