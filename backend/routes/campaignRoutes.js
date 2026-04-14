const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// Create Campaign
router.post("/", async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        const saved = await campaign.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Campaigns
router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Campaign by ID
router.get("/:id", async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if(!campaign) return res.status(404).json({ message: "Not found" });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;