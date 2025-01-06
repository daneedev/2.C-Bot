const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const coupon = database.define("coupon", {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reward: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    maxUses: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uses: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usedBy: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: "coupons",
    timestamps: false,
    modelName: "coupon"
})

coupon.sync()

module.exports = coupon;