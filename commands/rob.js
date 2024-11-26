const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");

new Command({
	name: 'rob',
	description: 'Okradni někoho',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    cooldown: "6h",
    arguments: [
        new Argument({
            name: "user",
            description: "Uživatel, kterého chceš okrást",
            type: ArgumentType.USER,
            required: true
        })
    ],
	run: async (ctx) => {
       const user = await User.findOne({where: {discordId: ctx.user.id}})
       const target = await User.findOne({where: {discordId: ctx.arguments.getUser("user").id}})
       const amount = Math.floor(Math.random() * target.cash)
         if (amount < 1) {
              const embed = new EmbedBuilder()
              .setTitle("Okradení")
              .setDescription("Uživatel nemá žádné peníze")
              .setColor("Random")
              ctx.reply({embeds: [embed]})
              return
         }
         if (user.id == target.id) {
                const embed = new EmbedBuilder()
                .setTitle("Okradení")
                .setDescription("Nemůžeš okrást sám sebe")
                .setColor("Random")
                ctx.reply({embeds: [embed], ephemeral: true})
                return
         }
         const success = Math.random() < 0.5
         if (success) {
                const embed = new EmbedBuilder()
                .setTitle("Okradení")
                .setDescription(`Okradl jsi <@${ctx.arguments.getUser("user").id}> a získal ${amount} Kč`)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
                user.cash += amount
                target.cash -= amount
                user.save()
                target.save()
         } else {
                const embed = new EmbedBuilder()
                .setTitle("Okradení")
                .setDescription(`Při pokusu o okradení <@${ctx.arguments.getUser("user").id}> si byl prozrazen a přišel jsi o -${amount} Kč`)
                .setColor("Red")
                ctx.reply({embeds: [embed]})
                if (user.cash < amount) {
                    user.cash = 0
                } else {
                user.cash -= amount
                }
                target.cash += amount
                user.save()
                target.save()
         }
    }
});
