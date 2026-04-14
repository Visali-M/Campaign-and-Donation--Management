const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
    title: String,
    description: String,
    targetAmount: Number,
    raisedAmount: {
        type: Number,
        default: 0
    },
    category: String,
    createdBy: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Campaign", CampaignSchema);