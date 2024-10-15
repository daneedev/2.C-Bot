const {Model, DataTypes} = require("sequelize")
const database = require("../database")


const Order = database.define("order", {
    status: {
        type: DataTypes.ENUM("Čeká se na kurýra", "Přijato kurýrem", "Doručuje se", "Doručeno", "Zrušeno"),
        allowNull: false
    },
    food: {
        type: DataTypes.STRING,
        allowNull: false
    },
    restaurant: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courierId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payment: {
        type: DataTypes.ENUM("card", "cash"),
        allowNull: false
    },
    tip: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "order",
    tableName: "orders",
    timestamps: false
})

Order.sync()

module.exports = Order;