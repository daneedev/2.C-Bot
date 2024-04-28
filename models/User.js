const {DataTypes} = require("sequelize")
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
        allowNull: false,
        defaultValue: 0
    },
    pocetZapisu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pocetZprav: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pocetSkull: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthdayShowAge: {
        type: DataTypes.BOOLEAN,
        allowNull: true    
    }
}, {
    modelName: "user",
    tableName: "users",
    timestamps: false
})

User.sync({alter: true})

module.exports = User;