const mongoose = require("mongoose")

const aukceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    time: { type: Number, required: true },
    messageID: { type: String, required: true },
    highestBid: { type: Number, required: true },
    highestBidder: { type: String },
    author: { type: String, required: true },
})

const model = mongoose.model("auctions", aukceSchema)
module.exports = model