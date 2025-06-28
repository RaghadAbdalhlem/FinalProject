const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getRecommendations } = require("../utils/ai_recommend");

const router = express.Router();

router.get("/", authMiddleware(['user']), async (req, res) => {
    try {
        const aiRes = await getRecommendations(req.user._id)
        return res.json({ success: true, data: aiRes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;