const express = require("express");
const router = express.Router();
const { Order } = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// Get all orders
router.get("/", authMiddleware(["admin", "content-manager", "user"]), async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("product", "title price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

// Get order by ID
router.get("/getOne/:id", authMiddleware(["admin", "content-manager", "user"]), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email").populate("product", "title price");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order details", error });
    }
});

module.exports = router;
