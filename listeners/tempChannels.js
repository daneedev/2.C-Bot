const { Listener } = require('gcommands');
const Discord = require('discord.js');
const fs = require("fs")
let channels = require("../data/channels.json")

new Listener({
    name: "tempChannels",
    event: "voiceStateUpdate",
    run: async (oldState, newState) => {
        const channelID = process.env.TEMP_CHANNEL_ID
        if (newState.channel !== null) {
            if (newState.channel.id === channelID) {
                newState.guild.channels.create({
                    name: `🔊 | ${newState.member.user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newState.channel.parent,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [Discord.PermissionFlagsBits.ManageChannels, Discord.PermissionFlagsBits.ManageRoles]
                        }
                    ]
                }).then(c => {
                    newState.setChannel(c)
                    const channel = {
                        id: c.id,
                        owner: newState.member.id,
                    }
                    channels.push(channel)
                    fs.writeFile(__dirname + "/../data/channels.json", JSON.stringify(channels, null, 4), (err) => {
                        if (err) console.log(err)
                    })
                })
            }
        } else {
            const tempChannel = channels.find(c => c.id === oldState.channel.id)
                if (tempChannel.id === oldState.channel.id && oldState.channel.members.size === 0) {
                            oldState.channel.delete()
                            channels = channels.filter(c => c.id !== oldState.channel.id)
                            fs.writeFile(__dirname + "/../data/channels.json", JSON.stringify(channels), (err) => {
                                if (err) console.log(err)
                            })
                }
        }
    }
})