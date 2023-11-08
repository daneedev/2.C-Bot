const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true }
})

const model = mongoose.model("users", userSchema)
module.exports = model