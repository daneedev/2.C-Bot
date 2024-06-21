const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const timetableUpdate = database.define("timetableUpdate", {
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "timetableUpdates",
    timestamps: false,
    modelName: "timetableUpdate"
})

timetableUpdate.sync()

module.exports = timetableUpdate;