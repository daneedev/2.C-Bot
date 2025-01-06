const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Coupon = require("../models/Coupon");
const User = require("../models/User");

new Command({
    name: 'activate', 
    description: 'Aktivuj kupon',
    type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "code",
            description: "Kód kupónu",
            type: ArgumentType.STRING,
            required: true
        })
    ],
    run: async (ctx) => {
        const code = ctx.arguments.getString("code")
        const embed = new EmbedBuilder()
        const coupon = await Coupon.findOne({where: {code: code}})
        if (!coupon) {
            embed.setTitle("Kupón neexistuje")
            embed.setDescription("Kupón s tímto kódem neexistuje")
            embed.setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else {
            if (coupon.uses >= coupon.maxUses) {
                embed.setTitle("Kupón již byl aktivován")
                embed.setDescription("Maximální počet použití kuponu byl dosažen, nelze ho aktivovat")
                embed.setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
            } else if (coupon.usedBy.includes(ctx.user.id)) {
                embed.setTitle("Kupón již byl aktivován")
                embed.setDescription("Tento kupon jsi již aktivoval")
                embed.setColor("Red")
                ctx.reply({embeds: [embed], ephemeral: true})
            } else {
                coupon.uses++
                coupon.usedBy = [...coupon.usedBy, ctx.user.id]
                coupon.save()
                const user = await User.findOne({where: {discordId: ctx.user.id}})
                user.cash += coupon.reward
                user.save()
                embed.setTitle("Kupón byl aktivován")
                embed.setDescription(`Kupón byl úspěšně aktivován (${coupon.uses}/${coupon.maxUses})\nDostal jsi ${coupon.reward} Kč`)
                embed.setColor("Green")
                ctx.reply({embeds: [embed], ephemeral: true})
            }
        }
    }
});