const express = require("express");
const { Water } = require("../models/Water");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET Water Intake for the current user (Today’s data)
router.get("/", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const waterData = await Water.findOne({ user: req.user._id, date: today });

        res.json({ success: true, data: waterData || { amount: 0, date: today } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST Water Intake (Create or Update)
router.post("/create", authMiddleware(['user']), async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be greater than zero" });
        }

        const today = new Date().toISOString().split("T")[0];
        let waterEntry = await Water.findOne({ user: req.user._id, date: today });

        if (waterEntry) {
            // Update existing record
            waterEntry.amount += amount;
            await waterEntry.save();
        } else {
            // Create new entry
            waterEntry = await Water.create({
                user: req.user._id,
                amount,
                date: today
            });
        }

        res.json({ success: true, data: waterEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
