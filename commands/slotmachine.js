const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')

new Command({
	name: 'slotmachine',
	description: 'Zahraj si na automatech',
    arguments: [
        new Argument({
            name: "amount",
            description: "Částka",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: async (ctx) => {
       const amount = ctx.arguments.getInteger("amount")
       const user = await User.findOne({where: {discordId: ctx.user.id}})
         if (amount < 1) {
              const embed = new EmbedBuilder()
              .setTitle("Nelze vsadit")
              .setDescription("Nelze vsadit méně než 1 Kč")
              .setColor("Red")
              ctx.reply({embeds: [embed], ephemeral: true})
              return
         }
         if (user.cash < amount) {
            const embed = new EmbedBuilder()
            .setTitle("Nedostatek peněz")
            .setDescription("Nemáš dostatek peněz na vsazení")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        const slots = ["🍒", "🍋", "🍇", "🍫"]
        const weights = [5, 15, 30, 50]

        function getRandomSymbol(symbols, weights) {
            const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
            let random = Math.random() * totalWeight;
        
            for (let i = 0; i < symbols.length; i++) {
                if (random < weights[i]) return symbols[i];
                random -= weights[i];
            }
        }        

        const slot1 = getRandomSymbol(slots, weights)
        const slot2 = getRandomSymbol(slots, weights)
        const slot3 = getRandomSymbol(slots, weights)
        const result = `| ${slot1} | ${slot2} | ${slot3} |`
        let prize = 0
        switch (result) {
            case "| 🍒 | 🍒 | 🍒 |":
                prize = amount * 3
                break
            case "| 🍋 | 🍋 | 🍋 |":
                prize = amount * 2.5
                break
            case "| 🍇 | 🍇 | 🍇 |":
                prize = amount * 2
                break
            case "| 🍫 | 🍫 | 🍫 |":
                prize = amount * 1.5
                break
            default:
                prize = -amount
                break
        } 
        
        user.cash += prize
        user.save()

        const embed = new EmbedBuilder()
        .setTitle("🎰 Automat")
        .setDescription(`+-------------+\n|--------------|\n${result}\n|--------------|\n+-------------+`)
        .addFields({name: "Výsledek", value: `${amount} Kč => **${commaNumber(prize)} Kč**`, inline: true},
            {name: "Šance", value: "🍒 5% - **3x**\n🍋 15% - **2.5x**\n🍇 30% - **2x**\n🍫 50% - **1.5x**", inline: true}
        )
        .setColor("Random")
        ctx.reply({embeds: [embed]})
    }
});