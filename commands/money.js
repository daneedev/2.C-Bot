const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");
const commaNumber = require('comma-number')
// Create a new command with the name 'hello'
new Command({
	name: 'money',
	description: 'Uprav peníze v databázi',
	// GCommands Next offers different types of commands, we will only use slash and message commands here.
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "action",
            description: "Akce, kterou chceš provést",
            type: ArgumentType.STRING,
            choices: [
                {
                    name: "Přidat",
                    value: "add"
                },
                {
                    name: "Odebrat",
                    value: "remove"
                },
                {
                    name: "Nastavit",
                    value: "set"
                }
            ],
            required: true
        }),
        new Argument({
            name: "user",
            description: "Uživatel, kterému chceš upravit peníze",
            type: ArgumentType.USER,
            required: true
        }),
        new Argument({
            name: "amount",
            description: "Částka, kterou chceš upravit",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
    run: async (ctx) => {
        const type = ctx.arguments.getString("action");
        const user = ctx.arguments.getUser("user");
        const amount = ctx.arguments.getInteger("amount");
        const userDB = await User.findOne({where: { discordId: user.id }});
        if (!ctx.member.roles.cache.has("1150872350091395233")) {
            const embed = new EmbedBuilder()
            .setTitle("Nemáš práva")
            .setDescription("Na tento příkaz nemáš dostatečná práva")
            .setColor("Red")
            ctx.reply({embeds: [embed]})
            return;
        }
        switch (type) {
            case "add":
                userDB.cash += amount;
                userDB.save();
                const embed = new EmbedBuilder()
                .setTitle("Peníze přidány")
                .setDescription(`Uživatel ${user} dostal ${commaNumber(amount)} Kč`)
                .setColor("Random")
                ctx.reply({embeds: [embed]})
                break;
            case "remove":
                userDB.cash -= amount;
                userDB.save();
                const embed2 = new EmbedBuilder()
                .setTitle("Peníze odebrány")
                .setDescription(`Uživateli ${user} bylo odebráno ${commaNumber(amount)} Kč`)
                .setColor("Random")
                ctx.reply({embeds: [embed2]})
                break;
            case "set":
                userDB.cash = amount;
                userDB.save();
                const embed3 = new EmbedBuilder()
                .setTitle("Peníze nastaveny")
                .setDescription(`Uživatel ${user} má nyní ${commaNumber(amount)} Kč`)
                .setColor("Random")
                ctx.reply({embeds: [embed3]})
                break;
        }
    }
});