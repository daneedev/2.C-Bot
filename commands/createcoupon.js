const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const Coupon = require("../models/Coupon");

new Command({
    name: 'createcoupon', 
    description: 'Vytvor kupon',
    type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "reward",
            description: "Odměna",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "maxuses",
            description: "Maximální počet použití",
            type: ArgumentType.INTEGER,
            required: true
        }),
        new Argument({
            name: "code",
            description: "Kód kupónu",
            type: ArgumentType.STRING,
            required: false
        })
    ],
    run: async (ctx) => {
        let code = ctx.arguments.getString("code")
        const reward = ctx.arguments.getString("reward")
        const maxUses = ctx.arguments.getInteger("maxuses")
        const embed = new EmbedBuilder()
        if (!ctx.member.roles.cache.has("1150872350091395233")) {
            embed.setTitle("Nemáš dostatečná oprávnění")
            embed.setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        }
        if (!code ) {
            code = generateCode(10)
        }
        const coupon = await Coupon.findOne({where: {code: code}})
        if (coupon) {
            embed.setTitle("Kupón s tímto kódem již existuje")
            embed.setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else {
            const newCoupon = new Coupon({
                code: code,
                reward: reward,
                maxUses: maxUses,
                uses: 0,
                usedBy: []
            })
            newCoupon.save()
            embed.setTitle("Kupón byl úspěšně vytvořen")
            embed.addFields(
                {name: "Kód", value: code, inline: true},
                {name: "Odměna", value: reward.toString(), inline: true},
                {name: "Maximální počet použití", value: maxUses.toString(), inline: true}
            )
            embed.setColor("Green")
            ctx.reply({embeds: [embed], ephemeral: true})
        }
    }
});


function generateCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }