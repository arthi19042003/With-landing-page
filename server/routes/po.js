const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../models/PurchaseOrder");

// ===============================
// @route   GET /api/po
// @desc    Get all purchase orders
// ===============================
router.get("/", async (req, res) => {
  try {
    const orders = await PurchaseOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching purchase orders:", error.message);
    res.status(500).json({ message: "Server error fetching purchase orders" });
  }
});

// ===============================
// @route   PUT /api/po/:id/status
// @desc    Update purchase order status (approve or reject)
// ===============================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating status:", error.message);
    res.status(500).json({ message: "Server error updating status" });
  }
});

module.exports = router;
