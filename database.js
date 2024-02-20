const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize("1cdb", "user", "pass", {
    dialect: "sqlite",
    host: "./1cdb.sqlite",
    logging: false
})

module.exports = sequelize;