const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');
const User = require("../models/User");


new Command({
	name: 'blackjack',
	description: 'Zahraj si blackjack',
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
        const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
        let score = 0
        let dealerScore = 0
        const playerCards = []
        const dealerCards = []


       let amount = ctx.arguments.getInteger("amount")
       const user = await User.findOne({where: {discordId: ctx.user.id}})
       if (user.inGame === true) {
              const embed = new EmbedBuilder()
                .setTitle("Nemůžeš použít ekonomiku")
                .setDescription("Nemůžeš použít ekonomiku, když jsi v hře")
                .setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
                return
       }
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

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("double").setLabel("Double").setStyle(ButtonStyle.Success)
        )

        const disabledRow = new ActionRowBuilder()	
        .addComponents(
            new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Primary).setDisabled(true),
            new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setCustomId("double").setLabel("Double").setStyle(ButtonStyle.Success).setDisabled(true)
        )

        let mainmsg;
        const firstHit = Hit()
        const embed = constructEmbed()
        ctx.reply({embeds: [embed], components: [row]}).then(msg =>  mainmsg = msg)
        user.inGame = true
        user.save()
        const filter = i => i.user.id === ctx.user.id

        const collector = ctx.channel.createMessageComponentCollector({filter: filter})

        collector.on("collect", async i => {
            switch (i.customId) { 
                case "hit":
                    const hit = Hit()
                    if (hit == -1) {
                        const embed = constructEmbed()
                        embed.setTitle("Blackjack: Prohrál jsi")
                        embed.setDescription("Překročil jsi 21")
                        embed.setColor("Red")
                        mainmsg.edit({embeds: [embed], components: [disabledRow]})
                        i.deferUpdate()
                        collector.stop()
                        user.cash -= amount
                        user.inGame = false
                        user.save()
                    } else if (playerCards.length == 5) {
                        const embed = constructEmbed()
                        embed.setTitle("Blackjack: Vyhrál jsi")
                        embed.setDescription("Máš 5 karet a nedosáhl jsi 21")
                        embed.setColor("Green")
                        mainmsg.edit({embeds: [embed], components: [disabledRow]})
                        i.deferUpdate()
                        collector.stop()
                        user.cash += amount
                        user.inGame = false
                        user.save()
                    } else {
                        const embed = constructEmbed()
                        embed.setDescription(`Akce: Získal si kartu s hodnotou **${hit}**`)
                        mainmsg.edit({embeds: [embed], components: [row]})
                        i.deferUpdate()
                    }
                    break;
                case "stand":
                    collector.stop()
                    const embed = constructEmbed()
                    embed.setDescription(`Akce: Zůstal si stát. Čeká se na tahy dealera`)
                    mainmsg.edit({embeds: [embed], components: [disabledRow]})
                    i.deferUpdate()
                    
                    dealerplay()
                    break;
                case "double":
                    if (amount * 2 > user.cash) {
                        i.reply({content: "Nemáš dostatek peněz na zdvojnásobení sázky", ephemeral: true})
                        return
                    }
                    collector.stop()
                    const double = Hit()
                    amount = amount * 2
                    if (double == -1) {
                        const embed = constructEmbed()
                        embed.setTitle("Blackjack: Prohrál jsi")
                        embed.setDescription("Překročil jsi 21")
                        embed.setColor("Red")
                        mainmsg.edit({embeds: [embed], components: [disabledRow]})
                        i.deferUpdate()
                        user.cash -= amount
                        user.save()
                    } else {
                        const embed = constructEmbed()
                        embed.setDescription(`Akce: Získal si kartu s hodnotou **${double}**`)
                        mainmsg.edit({embeds: [embed], components: [row]})
                        i.deferUpdate()
                        dealerplay()
                    }
                    break;
            }
        })

        function constructEmbed() {
            const embed = new EmbedBuilder()
             .setTitle("Blackjack")
            .addFields(
            {name: "Sázka", value: `${amount} Kč`, inline: true},
            {name: "Tvoje karty", value: (playerCards.join(", ") || "Žádné"), inline: true},
            {name: "Tvoje skóre", value: score.toString(), inline: true},
            {name: "Karty dealera", value: (dealerCards.join(", ") || "Žádné"), inline: true},
            {name: "Skóre dealera", value: dealerScore.toString(), inline: true}
            )
            .setColor("Random")
            .setDescription(`Akce: Získal si kartu s hodnotou **${firstHit}**`)
            return embed
        }

        function Hit() {
            const card = cards[Math.floor(Math.random() * cards.length)]
            score += card
            playerCards.push(card)
        
            if (score > 21) {
                return -1;
            } else {
                return card;
            }
        }
        
        function DealerPlay() {
            const card = cards[Math.floor(Math.random() * cards.length)]
            dealerScore += card
            dealerCards.push(card)
            return card
        }

        async function dealerplay()  {
            while (dealerScore < 17) {
                await new Promise(resolve => setTimeout(resolve, 2000))
                const dealerHit = DealerPlay();
                const embed = constructEmbed()
                embed.setDescription(`Akce: Dealer získal kartu s hodnotou **${dealerHit}**`);
                await mainmsg.edit({embeds: [embed], components: [disabledRow]});
            }

            if (dealerScore > 21) {
                const embed = constructEmbed()
                embed.setTitle("Blackjack: Vyhrál jsi")
                embed.setDescription("Dealer překročil 21")
                embed.setColor("Green")
                mainmsg.edit({embeds: [embed], components: [disabledRow]})
                collector.stop()
                user.cash += amount
                user.inGame = false
                user.save()
            } else if (dealerScore > score) {
                const embed = constructEmbed()
                embed.setTitle("Blackjack: Prohrál jsi")
                embed.setDescription("Dealer má lepší skóre")
                embed.setColor("Red")
                mainmsg.edit({embeds: [embed], components: [disabledRow]})
                collector.stop()
                user.cash -= amount
                user.inGame = false
                user.save()
            } else if (dealerScore < score) {
                const embed = constructEmbed()
                embed.setTitle("Blackjack: Vyhrál jsi")
                embed.setDescription("Máš lepší skóre než dealer")
                embed.setColor("Green")
                mainmsg.edit({embeds: [embed], components: [disabledRow]})
                collector.stop()
                user.cash += amount
                user.inGame = false
                user.save()
            } else if (dealerScore == score) {
                const embed = constructEmbed()
                embed.setTitle("Blackjack: Remíza")
                embed.setDescription("Máte stejné skóre")
                embed.setColor("Yellow")
                mainmsg.edit({embeds: [embed], components: [disabledRow]})
                collector.stop()
                user.inGame = false
                user.save()
            }
        }
    }
});