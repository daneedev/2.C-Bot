const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
	name: 'aukcepravidla',
	description: 'Napíše ti pravidla aukce',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Pravidla aukcí")
        .setDescription("**1.** Pokud vítěz aukce nezaplatí za daný předmět, autor aukce má právo požádat admina o tzv. aukční ban na vítěze soutěže\n\n*Aukční ban - Ban, který zabraňuje danému uživateli vytvářet a účastnit se aukcí. Délka banu je nastavena na dobu neurčitou, tudíž o unbanu rozhoduje admin.*\n\n**2.** Vytváření aukcí o neexistující položky je zakázáno a bude trestáno aukčním banem")
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
});