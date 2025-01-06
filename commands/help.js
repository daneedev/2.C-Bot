const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");

new Command({
	name: 'help', 
	description: 'Souhrn příkazů',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: async (ctx) => {
        const embed = new EmbedBuilder()
        .setTitle("Příkazy")
        .setDescription("Zde je seznam všech příkazů:\n\n**🖼️ Obrázky**\n/http - Ukáže fotku kočky\n/yapper - Ukáže fotku yappera\n/qrcode - Vygeneruje QR-Code s textem\n/clubcard - Ukáže clubcard do Tesca\n\n**Testy a zápisky**\n/testy - Ukáže testy, které se budou psát daný den\n/pridattest - Přidá test na daný datum\n/zapisky - Zobrazí odkazy na zápisky\n\n**🍔Jídlo**\n/obedy - Zobrazí co je dnes k obědu v ŠJ Štefánikova\n/delivery - Odesle objednavku na KFC delivery\n\n**🎰 Economy**\n/balance - Zobrazí zůstatek\n/transfer - Převést peníze z/na účet\n/work - Pracuj a vydělej si peníze (1h)\n/rob - Okraď někoho (2h)\n/slotmachine - Slot machine¨n/blackjack - Zahraj si blackjack\n/roulette - Zahraj si ruletu\n/activate - Aktivuj si kod\n/money - Uprav peníze v databázi\n/send - Pošle někomu peníze\n\n**🧰 Ostatní příkazy**\n/leaderboard - Ukáže různé leadeboardy\n/hlasovani - Vytvoří hlasování\n/hlaska - Pošle náhodnou hlášku\n/birthday - Nastaví datum narození\n/deleteallmydata - Smaže všechny data o tobě\n/info - Status bota")
        .setColor("Random")
        ctx.reply({embeds: [embed], ephemeral: true})
    }
});