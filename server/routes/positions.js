const express = require("express");
const router = express.Router();
const Position = require("../models/Position");
// ✅ Fix Import
const protect = require("../middleware/auth"); 

// ✅ GET positions
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const positions = await Position.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json(positions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST Position
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const newPosition = await Position.create({ ...req.body, createdBy: userId });
    res.status(201).json(newPosition);
  } catch (err) {
    console.error("Error creating position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT Position
router.put("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updated = await Position.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Position not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE Position
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const deleted = await Position.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    if (!deleted) return res.status(404).json({ message: "Position not found" });
    res.json({ message: "Position deleted" });
  } catch (err) {
    console.error("Error deleting position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;