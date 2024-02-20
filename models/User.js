const {Model, DataTypes} = require("sequelize")
const database = require("../database")


const User = database.define("user", {
    discordId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pocetHlasek: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pocetZapisu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pocetZprav: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    modelName: "user",
    tableName: "users",
    timestamps: false
})

User.sync()

module.exports = User;