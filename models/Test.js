const {Model, DataTypes} = require("sequelize")
const database = require("../database")


const Test = database.define("test", {
    tema: {
        type: DataTypes.STRING,
        allowNull: false
    },
    predmet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    den: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mesic: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "test",
    tableName: "testy",
    timestamps: false
})

Test.sync()

module.exports = Test;