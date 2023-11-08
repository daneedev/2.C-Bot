const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require('discord.js');
const ms = require("ms")
const fs = require("fs")
const Aukce = require("../models/Auction")
const User = require("../models/AuctionUser")

new Command({
	name: 'aukce',
	description: 'Vytvoří aukci ;   ',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "vec",
            description: "Co se bude dražit",
            required: true,
            type: ArgumentType.STRING
        }),
        new Argument({
            name: "cena",
            description: "Za kolik se bude dražit",
            required: true,
            type: ArgumentType.INTEGER
        }),
        new Argument({
            name: "cas",
            description: "Jak dlouho se bude dražit",
            required: true,
            type: ArgumentType.STRING
        }),
        new Argument({
            name: "nahled",
            description: "Náhledový obrázek",
            required: false,
            type: ArgumentType.ATTACHMENT
        }),
    ],
	run: async (ctx) => {
        const vec = ctx.arguments.getString("vec")
        const cena = ctx.arguments.getInteger("cena")
        const cas = ctx.arguments.getString("cas")
        const user = await User.findOne({userID: ctx.user.id})
        if (user) {
            const error = new Discord.EmbedBuilder()
            error.setTitle("Nemůžeš vytvořit aukci, máš aukční ban!")
            error.setColor("Red")
            ctx.reply({embeds: [error], ephemeral: true})
        } else {
        const pridat10kc = new Discord.ButtonBuilder()
        .setCustomId("pridat10kc")
        .setLabel("Přihodit 10 Kč")
        .setStyle(Discord.ButtonStyle.Primary)

        const pridat20kc = new Discord.ButtonBuilder()
        .setCustomId("pridat20kc")
        .setLabel("Přihodit 20 Kč")
        .setStyle(Discord.ButtonStyle.Danger)

        const pridat50kc = new Discord.ButtonBuilder()
        .setCustomId("pridat50kc")
        .setLabel("Přihodit 50 Kč")
        .setStyle(Discord.ButtonStyle.Success)

        const row = new Discord.ActionRowBuilder()
        .addComponents(pridat10kc, pridat20kc, pridat50kc)
        
        const replyembed = new Discord.EmbedBuilder()
        .setTitle("Aukce spuštěna!")
        .setColor("Green")
        ctx.reply({embeds: [replyembed], ephemeral: true})

        const time = Math.floor((new Date().getTime() + ms(cas)) / 1000)
        const embed = new Discord.EmbedBuilder()
        .setTitle(`Právě se draží ${vec}`)
        .addFields(
            { name: "Nejvyšší nabídka", value: `${cena} Kč`, inline: true},
            { name: "Nejvyšší nabízející", value: "Nikdo", inline: true},
            { name: "Čas do konce", value: `<t:${time}:R>`, inline: true},
            { name: "Startovací cena", value: `${cena} Kč`, inline: true},
        )
        .setColor("Random")
        .setFooter({text: `⚠️: Pročtěte si pravidla aukcí pomocí příkazu /aukcepravidla | Neznalost pravidel se neomlouvá!`})
        let mainmsg;
        ctx.channel.send({embeds: [embed], components: [row]}).then(msg => {
            const aukce = new Aukce({
                name: vec,
                messageID: msg.id,
                startingPrice: cena,
                highestBid: cena,
                highestBidder: null,
                time: time,
                author: ctx.user.id,
            })
            aukce.save()
            mainmsg = msg
        })
        const collector = ctx.channel.createMessageComponentCollector({componentType: Discord.ComponentType.Button, time: ms(cas)})
        collector.on("collect", async (i) => {
            const aukce = await Aukce.findOne({messageID: i.message.id})
            const user = await User.findOne({userID: i.member.user.id})
            if (i.member.user.id == aukce.author) {
                const error = new Discord.EmbedBuilder()
                error.setTitle("Nemůžeš přihodit na vlastní aukci!")
                error.setColor("Red")
                i.reply({embeds: [error], ephemeral: true})
            } else if (i.member.user.id == aukce.highestBidder) {
                const error = new Discord.EmbedBuilder()
                error.setTitle("Nemůžeš přihodit, jsi nejvyšší nabízející!")
                error.setColor("Red")
                i.reply({embeds: [error], ephemeral: true})
            } else if (user) {
                const error = new Discord.EmbedBuilder()
                error.setTitle("Nemůžeš přihodit, máš aukční ban!")
                error.setColor("Red")
                i.reply({embeds: [error], ephemeral: true})
            } else {
            let aukce = await Aukce.findOne({messageID: i.message.id})
            switch (i.customId) {
                case "pridat10kc":
                    await Aukce.updateOne({messageID: i.message.id}, {highestBid: aukce.highestBid + 10, highestBidder: i.member.user.id})
                    break;
                case "pridat20kc":
                    await Aukce.updateOne({messageID: i.message.id}, {highestBid: aukce.highestBid + 20, highestBidder: i.member.user.id})
                    break;
                case "pridat50kc":
                    await Aukce.updateOne({messageID: i.message.id}, {highestBid: aukce.highestBid + 50, highestBidder: i.member.user.id})
                    break;
                default:
                    break;
            }
            aukce = await Aukce.findOne({messageID: i.message.id})
            const embed = new Discord.EmbedBuilder()
            .setTitle(`Právě se draží ${aukce.name}`)
            .addFields(
                { name: "Nejvyšší nabídka", value: `${aukce.highestBid} Kč`, inline: true},
                { name: "Nejvyšší nabízející", value: `<@${aukce.highestBidder}>`, inline: true},
                { name: "Čas do konce", value: `<t:${aukce.time}:R>`, inline: true},
                { name: "Startovací cena", value: `${aukce.startingPrice} Kč`, inline: true},
                { name: "Autor", value: `<@${aukce.author}>`, inline: true}
            )
            .setFooter({text: `⚠️: Pročtěte si pravidla aukcí pomocí příkazu /aukcepravidla | Neznalost pravidel se neomlouvá!`})
            .setColor("Random")
            i.update({embeds: [embed], components: [row]})
        }
        })
        collector.on("end", async (i) => {
            const aukce = await Aukce.findOne({messageID: mainmsg.id})
            if (aukce.highestBidder == null) {
                const embed = new Discord.EmbedBuilder()
                .setTitle("Aukce skončila!")
                .setColor("Red")
                .setDescription(`Nikdo se nezapojil do aukce o **${aukce.name}**`)
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                mainmsg.edit({embeds: [embed], components: [row]})
                await Aukce.deleteOne({messageID: mainmsg.id})
            } else {
            const embed = new Discord.EmbedBuilder()
            .setTitle("Aukce skončila!")
            .setColor("Red")
            .setDescription(`Vítězem aukce o **${aukce.name}** se stal <@${aukce.highestBidder}> s nabídkou **${aukce.highestBid}** Kč!`)
            row.components[0].setDisabled(true)
            row.components[1].setDisabled(true)
            row.components[2].setDisabled(true)
            mainmsg.edit({embeds: [embed], components: [row]})
            await Aukce.deleteOne({messageID: mainmsg.id})
            }
        })
    }
    }
    
});