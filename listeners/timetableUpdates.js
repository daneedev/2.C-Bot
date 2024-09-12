const { Listener } = require("gcommands")
const Discord = require("discord.js")
const axios = require("axios")
const dayjs = require("dayjs")
const timetableUpdate = require("../models/timetableUpdate")

new Listener({
    name: "timetableUpdates",
    event: "ready",
    run: async (client) => {
        setInterval(async () => {
        const request = await axios.get(`https://obrazovka.200solutions.com/api.php?date=${dayjs().format("YYYYMMDD")}`)
        const data = request.data.ChangesForClasses
        const classData = data.find(i => i.Class.Id === "28")
        const canceled = classData.CancelledLessons
        const changed = classData.ChangedLessons
        let text = ""
        if (await timetableUpdate.findOne({ where: { date: dayjs().format("YYYYMMDD"), data: JSON.stringify(classData)}})) return
        const embed = new Discord.EmbedBuilder()
        if (canceled.length > 0) { text += "**🎉 Odpadlé hodiny 🎉**\n"; embed.setColor("Green") }
        canceled.forEach(i => {
            text += `${i.Hour}. hodina ${i.Subject} (${i.Group}) odpadá\n`
        })
        if (changed.length > 0) { text += "\n**Suplované hodiny**\n"; embed.setColor("Red")}
        changed.forEach(i => {
            text += `${i.Hour}. hodinu ${i.Teacher} supluje ${i.Subject} (${i.Group}) v místnosti ${i.Room}\n`
        })
        const channel = client.channels.cache.get("1212842962128609301")

        embed.setTitle("Změny v rozvrhu")
        embed.setDescription(text)
        channel.send({ embeds: [embed]})
        timetableUpdate.create({ date: dayjs().format("YYYYMMDD"), data: JSON.stringify(classData) })
    }, 600000)
    }
})