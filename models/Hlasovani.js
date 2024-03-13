const {Model, DataTypes} = require("sequelize")
const database = require("../database")


const Hlasovani = database.define("hlasovani", {
    messageId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    options: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usersReacted: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    modelName: "hlasovani",
    tableName: "hlasovani",
    timestamps: false
})

Hlasovani.sync()

module.exports = Hlasovani;