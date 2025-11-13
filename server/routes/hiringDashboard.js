const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Position = require("../models/Position"); // You need this to find your jobs
const protect = require("../middleware/auth");

router.get("/summary", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // 1. Find all Jobs (Positions) created by this Hiring Manager
    const myJobs = await Position.find({ createdBy: userId }).select("_id");
    const myJobIds = myJobs.map(job => job._id);

    // 2. Find Applications linked to these Jobs (OR created by the manager manually)
    const query = { 
      $or: [
        { jobId: { $in: myJobIds } },   // Applications for my jobs
        { createdBy: userId }           // Candidates I added manually
      ]
    };

    // 3. Run counts
    const [totalSubmissions, interviewsScheduled, offersMade, hired] = await Promise.all([
      Application.countDocuments(query),
      Application.countDocuments({ ...query, status: "Interview" }),
      Application.countDocuments({ ...query, status: "Offer" }),
      Application.countDocuments({ ...query, status: "Hired" })
    ]);

    res.json({
      totalSubmissions,
      interviewsScheduled,
      offersMade,
      hired
    });
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;