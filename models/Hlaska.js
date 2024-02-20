const {Model, DataTypes} = require("sequelize")
const database = require("../database")


const Hlaska = database.define("hlaska", {
    messageId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: "hlaska",
    tableName: "hlasky",
    timestamps: false
})

Hlaska.sync()

module.exports = Hlaska;