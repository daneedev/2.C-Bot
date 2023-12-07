const { Listener } = require('gcommands');
const adminChannelID = process.env.ADMIN_CHANNEL
const { EmbedBuilder } = require("discord.js")

new Listener({
    name: "editMessage",
    event: "messageUpdate",
    run: (oldMessage, newMessage) => {
        const adminChannel = oldMessage.guild.channels.cache.find((channel) => channel.id == adminChannelID)
        if (oldMessage.content != newMessage.content) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Zpráva upravena")
            .addFields(
                {name: "Autor zprávy", value: `<@${oldMessage.author.id}>`, inline: true},
                {name: "Původní zpráva", value: oldMessage.content, inline: true},
                {name: "Nová zpráva", value: newMessage.content, inline: true},
                {name: "Kanál", value: `<#${oldMessage.channel.id}>`, inline: true},
                {name: "Zobrazit zprávu", value: `[Klikni zde](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`, inline: true}
            )
            adminChannel.send({embeds: [embed]})
        }
    }
})

new Listener({
    name: "createChannel",
    event: "channelCreate",
    run: (channel) => {
        let type;
        if (channel.type == 0) { type = "Textový kanál"} else if (channel.type == 2) { type = "Hlasový kanál"} else if (channel.type == 15) { type = "Fórum"} else if (channel.type == 5) { type = "Kanál oznámení"} else if (channel.type == 13) { type = "Stage kanál"}
        const adminChannel = channel.guild.channels.cache.find((channel) => channel.id == adminChannelID)
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Vytvořen kanál")
        .addFields(
            {name: "Název kanálu", value: channel.name, inline: true},
            {name: "Typ kanálu", value: type || channel.type, inline: true},
            {name: "ID kanálu", value: channel.id, inline: true},
            {name: "Zobrazit kanál", value: `[Klikni zde](https://discord.com/channels/${channel.guild.id}/${channel.id})`, inline: true}
        )
        adminChannel.send({embeds: [embed]})
    }
})

new Listener({
    name: "roleUpdate",
    event: "roleUpdate",
    run: (oldRole, newRole) => {
        const adminChannel = oldRole.guild.channels.cache.find((channel) => channel.id == adminChannelID)
        let oldpermissions = ""
        oldRole.permissions.toArray().forEach((permission) => {
            oldpermissions = `${oldpermissions}\n${permission}`
        })
        let newpermissions = ""
        newRole.permissions.toArray().forEach((permission) => {
            newpermissions = `${newpermissions}\n${permission}`
        })
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Role upravena")
        .addFields(
            {name: "Název původní role", value: oldRole.name, inline: true},
            {name: "Práva původní role", value: oldpermissions, inline: true},
            {name: "Název nové role", value: newRole.name, inline: true},
            {name: "Práva nové role", value: newpermissions, inline: true},
        )
        adminChannel.send({embeds: [embed]})
    }
})