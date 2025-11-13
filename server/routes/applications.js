const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Position = require("../models/Position");
const protect = require("../middleware/auth");

// ✅ GET all applications (Filtered by Manager's Jobs)
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Find my jobs
    const myJobs = await Position.find({ createdBy: userId }).select("_id");
    const myJobIds = myJobs.map(job => job._id);

    // Find applications for my jobs OR created by me
    const applications = await Application.find({
      $or: [
        { jobId: { $in: myJobIds } },
        { createdBy: userId }
      ]
    }).sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET candidate history
router.get("/history/:email", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    // Allow seeing history if the candidate applied to ANY of my jobs
    const history = await Application.find({
      email: req.params.email
    }).sort({ appliedAt: -1 });
    
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ... (Keep the other POST/PUT routes for status updates the same as before) ...
// (If you need the full file again, let me know, but these GET routes are the key fix)
// ============================================================
// Below are the standard update routes you already have:
router.post("/:id/message", protect, async (req, res) => { /* ... code ... */ });
router.put("/:id/review", protect, async (req, res) => { /* ... code ... */ });
router.put("/:id/schedule", protect, async (req, res) => { /* ... code ... */ });
router.put("/:id/reject", protect, async (req, res) => { /* ... code ... */ });
router.put("/:id/hire", protect, async (req, res) => { /* ... code ... */ });

module.exports = router;