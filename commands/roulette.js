const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')
const roulette = require("../data/roulette.json")

new Command({
	name: 'roulette',
	description: 'Zahraj si ruletu',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "type",
            description: "Typ sázky",
            type: ArgumentType.STRING,
            choices: [
                {
                    name: "Číslo",
                    value: "number"
                },
                {
                    name: "Barva",
                    value: "color"
                },
                {
                    name: "Liché/Sudé",
                    value: "evenodd"
                },
                {
                    name: "1-18/19-36",
                    value: "half"
                }
            ],
            required: true
        }),
        new Argument({
            name: "value",
            description: "Hodnota sázky",
            type: ArgumentType.STRING,
            run: (ctx) => {
                const type = ctx.interaction.options.getString("type")
                switch (type) {
                    case "number":
                        ctx.respond([]);
                        break;
                    case "color":
                        const color = roulette.find(bet => bet.type === "color")
                        ctx.respond(color.bets)
                        break;
                    case "evenodd":
                        const evenodd = roulette.find(bet => bet.type === "evenodd")
                        ctx.respond(evenodd.bets)
                        break;
                    case "half":
                        const half = roulette.find(bet => bet.type === "half")
                        ctx.respond(half.bets)
                        break;
                }
            },
            required: true
        }),
        new Argument({
            name: "amount",
            description: "Částka, kterou chceš vsadit",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
	run: async (ctx) => {
        const type = ctx.arguments.getString("type");
        const value = ctx.arguments.getString("value");
        const amount = ctx.arguments.getInteger("amount");

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

      const colors = ["Červená", "Černá", "Zelená"]
      let color = Math.floor(Math.random() * 2)
      let number = Math.floor(Math.random() * 38)
      if (number === 37) {
        number = 0
        color = 2
      }
      

      let mainmsg;
      let result;
      let win;

      switch (type) {
        case "number":
            if (value < 1 || value > 36) {
                const embed = new EmbedBuilder()
                .setTitle("Chyba")
                .setDescription("Číslo musí být mezi 1 a 36")
                .setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
                return
            }
            if (value == number) {
                user.cash += amount * 36
                user.save()
                result = 1
                win = amount * 36
            } else {
                user.cash -= amount
                user.save()
                win = -amount
                result = 0
            }
            break;
        case "color":
            if (value === colors[color]) {
                user.cash += amount 
                user.save()
                result = 1
                win = amount * 2
            } else {
                user.cash -= amount
                user.save()
                result = 0
                win = -amount
            }
            break;
        case "evenodd":
            if (value === "even" && number % 2 === 0) {
                user.cash += amount
                user.save()
                result = 1
                win = amount * 2
            } else if (value === "odd" && number % 2 !== 0) {
                user.cash += amount
                user.save()
                result = 1
                win = amount * 2
            } else {
                user.cash -= amount
                user.save()
                result = 0
                win = -amount
            }
            break;
        case "half":
            if (value === "1-18" && number >= 1 && number <= 18) {
                user.cash += amount
                user.save()
                result = 1
                win = amount * 2
            } else if (value === "19-36" && number >= 19 && number <= 36) {
                user.cash += amount
                user.save()
                result = 1
                win = amount * 2
            } else {
                user.cash -= amount
                user.save()
                result = 0
                win = -amount
            }
            break;
      }
      const embed = new EmbedBuilder()
        .setTitle("Ruleta")
        .setDescription("Ruleta se točí...")
        .setColor("Random")
        ctx.reply({embeds: [embed]}).then(msg => mainmsg = msg)
        user.inGame = true
        user.save()

        setTimeout(() => {
            const embed2 = new EmbedBuilder()
            .setTitle("Ruleta")
            .addFields(
                {name: "Typ sázky", value: type, inline: true},
                {name: "Hodnota sázky", value: value, inline: true},
                {name: "Částka", value: amount.toString(), inline: true},
                {name: "Výsledek", value: result === 1 ? "Vyhrál jsi" : "Prohrál jsi", inline: true},
            )
            .setDescription(`Padlo číslo **${number}** ${color === 0 ? "🔴" : color === 1 ? "⚫" : "🟢"}`)

            if (result === 1) {
                embed2.setColor("Green")
                embed2.setDescription(embed2.data.description + `\n\n${amount} => **${win} Kč**`)
            } else {
                embed2.setColor("Red")
                embed2.setDescription(embed2.data.description + `\n\n${amount} => **${win} Kč**`)
            }
            mainmsg.edit({embeds: [embed2]})

            user.inGame = false
            user.save()
        }, 3000)
    }
});