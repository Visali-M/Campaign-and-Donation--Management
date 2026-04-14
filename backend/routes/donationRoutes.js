const express = require("express");
const router = express.Router();

const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// Donate to Campaign
router.post("/", async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();

        // Update campaign raised amount
        const campaign = await Campaign.findById(req.body.campaignId);
        if (campaign) {
            campaign.raisedAmount += req.body.amount;
            await campaign.save();
        }

        res.status(201).json({ message: "Donation successful", donation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get donors for a campaign
router.get("/:campaignId", async (req, res) => {
    try {
        const donations = await Donation.find({
            campaignId: req.params.campaignId
        });

        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;