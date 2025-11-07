const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// === Get all candidates ===
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

// === Update candidate status (Shortlist / Reject) ===
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Status updated successfully", candidate });
  } catch (err) {
    console.error("Error updating candidate:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
