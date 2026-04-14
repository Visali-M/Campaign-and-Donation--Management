const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    campaignId: String,
    donorName: String,
    amount: Number,
    message: String,
    donationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Donation", DonationSchema);