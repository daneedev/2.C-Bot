const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Order = require("../models/Order")
const Discord = require("discord.js")

new Command({
    name: "delivery",
    description: "Objedná ti jídlo/zobrazí objednávky",
    type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "order",
            description: "Objedná ti jídlo",
            type: ArgumentType.SUB_COMMAND,
            arguments: [
                new Argument({
                    name: "restaurant",
                    description: "Restaurace, ze které si chceš objednat",
                    type: ArgumentType.STRING,
                    choices: [
                        {name: "McDonald's", value: "mcdonalds"},
                        {name: "KFC", value: "kfc"},
                    ],
                    required: true
                }),
                new Argument({
                    name: "food",
                    description: "Tvá objednávka",
                    type: ArgumentType.STRING,
                    required: true
                }),
                new Argument({
                    name: "payment",
                    description: "Způsob platby",
                    type: ArgumentType.STRING,
                    choices: [
                        {name: "Převodem na účet", value: "card"},
                        {name: "Hotově", value: "cash"}
                    ],
                    required: true
                }),
                new Argument({
                    name: "tip",
                    description: "Spropitné",
                    type: ArgumentType.INTEGER,
                    required: true
                })
            ]
        }),
        new Argument({
            name: "orders",
            description: "Zobrazí ti objednávky",
            type: ArgumentType.SUB_COMMAND
        })
    ],
    run: async (ctx) => {
        const subcmd = ctx.arguments.getSubcommand()
        if (subcmd == "order") {
            const restaurant = ctx.arguments.getString("restaurant")
            const food = ctx.arguments.getString("food")
            const order = await Order.create({
                restaurant: restaurant,
                food: food,
                status: "Čeká se na kurýra",
                customerId: ctx.user.id,
                payment: ctx.arguments.getString("payment"),
                tip: ctx.arguments.getInteger("tip")
            })

            // ORDER REPLY
            const reply = new Discord.EmbedBuilder()
            .setTitle("Objednávka byla úspěšně vytvořena")
            .setColor("Green")
            ctx.reply({embeds: [reply], ephemeral: true})

            // ORDER DM
            const embed = new Discord.EmbedBuilder()
            .setTitle("Podrobnosti objednávky")
            .setColor("Yellow")
            .addFields(
                {name: "ID", value: order.id.toString(), inline: true},
                {name: "Restaurace", value: restaurant, inline: true},
                {name: "Jídlo", value: food, inline: true},
                {name: "Status", value: "Čeká se na kurýra", inline: true},
                {name: "Kurýr", value: "-", inline: true}
            )
            .setFooter({text: "Pokud do 10 minut nebude objednávka přijata kurýrem, bude zrušena"})
            ctx.user.send({embeds: [embed]})

            // ORDER CHANNEL

            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setLabel("Přijmout objednávku")
                .setCustomId(`acceptOrder_${order.id}`)
                .setStyle(Discord.ButtonStyle.Success)
            )

            const ordersChannel = ctx.guild.channels.cache.get("1295646153043349556")
            const ordersEmbed = new Discord.EmbedBuilder()
            .setTitle("Nová objednávka")
            .setColor("Yellow")
            .addFields(
                {name: "ID", value: order.id.toString(), inline: true},
                {name: "Restaurace", value: restaurant, inline: true},
                {name: "Jídlo", value: food, inline: true},
                {name: "Status", value: "Čeká se na kurýra", inline: true},
                {name: "Zákazník", value: `<@${ctx.user.id}>`, inline: true},
                {name: "Platba", value: ctx.arguments.getString("payment"), inline: true},
                {name: "Spropitné", value: `${ctx.arguments.getInteger("tip").toString()} Kč`, inline: true}
            )
            ordersChannel.send({embeds: [ordersEmbed], components: [row]})

            const filter = i => i.customId.startsWith("acceptOrder")
            const collector = ordersChannel.createMessageComponentCollector({filter: filter, time: 600000})

            collector.on("collect", async i => {
                const orderId = i.customId.split("_")[1]
                const order = await Order.findOne({where: {id: orderId}})
                order.status = "Přijato kurýrem"
                order.courierId = i.user.id
                order.save()

                const row2 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("Převzato")
                    .setCustomId(`pickedOrder_${order.id}`)
                    .setStyle(Discord.ButtonStyle.Success)
                )
                const filter2 = a => a.customId.startsWith("pickedOrder") && a.user.id == order.courierId
                const collector2 = ordersChannel.createMessageComponentCollector({filter: filter2})

                const orderEmbed = new Discord.EmbedBuilder()
                .setTitle("Objednávka přijata")
                .setColor("Green")
                .addFields(
                    {name: "ID", value: orderId, inline: true},
                    {name: "Restaurace", value: order.restaurant, inline: true},
                    {name: "Jídlo", value: order.food, inline: true},
                    {name: "Status", value: "Přijato kurýrem", inline: true},
                    {name: "Zákazník", value: `<@${order.customerId}>`, inline: true},
                    {name: "Platba", value: order.payment, inline: true},
                    {name: "Spropitné", value: `${order.tip} Kč`, inline: true},
                    {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                )
                i.update({embeds: [orderEmbed], components: [row2]})

                const userEmbed = new Discord.EmbedBuilder()
                .setTitle("Objednávka přijata")
                .setColor("Green")
                .addFields(
                    {name: "ID", value: orderId, inline: true},
                    {name: "Restaurace", value: order.restaurant, inline: true},
                    {name: "Jídlo", value: order.food, inline: true},
                    {name: "Status", value: "Přijato kurýrem", inline: true},
                    {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                )
                
                const user = await ctx.client.users.cache.get(order.customerId)
                user.send({embeds: [userEmbed]})

                collector2.on("collect", async c => {
                    const orderId = c.customId.split("_")[1]
                    const order = await Order.findOne({where: {id: orderId}})
                    order.status = "Doručuje se"
                    order.save()

                    const row3 = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setLabel("Doručeno")
                        .setCustomId(`deliveredOrder_${order.id}`)
                        .setStyle(Discord.ButtonStyle.Success)
                    )
                    const filter3 = a => a.customId.startsWith("deliveredOrder") && a.user.id == order.courierId
                    const collector3 = ordersChannel.createMessageComponentCollector({filter: filter3})

                    const orderEmbed = new Discord.EmbedBuilder()
                    .setTitle("Objednávka doručována")
                    .setColor("Green")
                    .addFields(
                        {name: "ID", value: orderId, inline: true},
                        {name: "Restaurace", value: order.restaurant, inline: true},
                        {name: "Jídlo", value: order.food, inline: true},
                        {name: "Status", value: "Doručuje se", inline: true},
                        {name: "Zákazník", value: `<@${order.customerId}>`, inline: true},
                        {name: "Platba", value: order.payment, inline: true},
                        {name: "Spropitné", value: `${order.tip} Kč`, inline: true},
                        {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                    )
                    c.update({embeds: [orderEmbed], components: [row3]})

                    const userEmbed = new Discord.EmbedBuilder()
                    .setTitle("Objednávka doručována")
                    .setColor("Green")
                    .addFields(
                        {name: "ID", value: orderId, inline: true},
                        {name: "Restaurace", value: order.restaurant, inline: true},
                        {name: "Jídlo", value: order.food, inline: true},
                        {name: "Status", value: "Doručuje se", inline: true},
                        {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                    )

                    user.send({embeds: [userEmbed]})

                    collector2.stop()

                    collector3.on("collect", async d => {
                        const orderId = d.customId.split("_")[1]
                        const order = await Order.findOne({where: {id: orderId}})
                        order.status = "Doručeno"
                        order.save()

                        const orderEmbed = new Discord.EmbedBuilder()
                        .setTitle("Objednávka doručena")
                        .setColor("Green")
                        .addFields(
                            {name: "ID", value: orderId, inline: true},
                            {name: "Restaurace", value: order.restaurant, inline: true},
                            {name: "Jídlo", value: order.food, inline: true},
                            {name: "Status", value: "Doručeno", inline: true},
                            {name: "Zákazník", value: `<@${order.customerId}>`, inline: true},
                            {name: "Platba", value: order.payment, inline: true},
                            {name: "Spropitné", value: `${order.tip} Kč`, inline: true},
                            {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                        )
                        d.update({embeds: [orderEmbed], components: []})

                        const userEmbed = new Discord.EmbedBuilder()
                        .setTitle("Objednávka doručena")
                        .setColor("Green")
                        .addFields(
                            {name: "ID", value: orderId, inline: true},
                            {name: "Restaurace", value: order.restaurant, inline: true},
                            {name: "Jídlo", value: order.food, inline: true},
                            {name: "Status", value: "Doručeno", inline: true},
                            {name: "Kurýr", value: `<@${i.user.id}>`, inline: true}
                        )

                        user.send({embeds: [userEmbed]})

                        collector3.stop()
                    })
                })
            }) 
        } else {
            const orders = await Order.findAll({where: {customerId: ctx.user.id}})
            let orderstext = ""
            orders.forEach(order => {
                orderstext += `ID: ${order.id}\nObjednávka: ${order.food}\nStatus: ${order.status}\n`
            })
            const embed = new Discord.EmbedBuilder()
            .setTitle("Tvoje objednávky")
            .setColor("Yellow")
            .setDescription(orderstext)
            ctx.reply({embeds: [embed], ephemeral: true})
        }
    }
})