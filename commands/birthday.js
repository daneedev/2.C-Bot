const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const User = require("../models/User");

new Command({
	name: 'birthday', 
	description: 'Uloží si tvé narozeniny',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: "birthday",
            description: "Tvé narozeniny (formát: DD.MM.YYYY)",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "showage",
            description: "Zobrazí tvůj věk při narozeninách",
            type: ArgumentType.BOOLEAN,
            required: true
        })
    ],
	run: async (ctx) => {
        const birthday = ctx.arguments.getString("birthday")
        const showage = ctx.arguments.getBoolean("showage")
        function useRegex(input) {
            let regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
            return regex.test(input);
        }
        console.log(useRegex(birthday));
        if (!useRegex(birthday)) {
            const embed = new EmbedBuilder()
            .setTitle("Špatný formát narozenin")
            .setDescription("Použij: `DD.MM.YYYY`")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
        const user = await User.findOne({where: {discordId: ctx.user.id}})
        if (user.birthday === null) {
            user.birthday = birthday
            user.birthdayShowAge = showage
            user.save()
            const embed = new EmbedBuilder()
            .setTitle(`Uložil jsem si tvé narozeniny: ${birthday}`)
            .setColor("Random")
            ctx.reply({embeds: [embed], ephemeral: true})
        } else {
            const embed = new EmbedBuilder()
            .setTitle("Už jsi si jednou uložil narozeniny")
            .setDescription("Pokud chceš změnit datum, kontaktuj administrátora")
            .setColor("Red")
            ctx.reply({embeds: [embed], ephemeral: true})
            return
        }
    }
});