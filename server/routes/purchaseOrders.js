// server/routes/purchaseOrders.js
const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../models/PurchaseOrder");
const protect = require("../middleware/auth"); // ✅ Corrected Import

/**
 * ✅ GET - Fetch all POs for the logged-in hiring manager
 */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await PurchaseOrder.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching POs:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * ✅ POST - Create a new Purchase Order
 */
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Basic validation
    if (!req.body.poNumber || !req.body.candidateName || !req.body.amount) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newOrder = new PurchaseOrder({
      ...req.body,
      createdBy: userId,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating PO:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "PO Number already exists." });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * ✅ DELETE - Remove a PO
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const deleted = await PurchaseOrder.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    res.json({ message: "Purchase Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting PO:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;