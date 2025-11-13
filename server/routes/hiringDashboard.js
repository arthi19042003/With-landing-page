const express = require("express");
const router = express.Router();
// ✅ FIX: Import 'Submission' model (where candidates are actually saved)
const Submission = require("../models/Submission");
// Fallback: If you use 'Application' model instead, uncomment next line
// const Submission = require("../models/Application"); 

const Position = require("../models/Position");
const protect = require("../middleware/auth");

router.get("/summary", protect, async (req, res) => {
  try {
    // ✅ Use req.userId from the fixed auth middleware
    const userId = req.userId; 

    // 1. Find all Jobs (Positions) created by this Hiring Manager
    const myJobs = await Position.find({ createdBy: userId }).select("_id");
    const myJobIds = myJobs.map(job => job._id);

    // 2. Build Query to find Submissions for these jobs
    // We check multiple field names to be safe (position, positionId, job)
    const query = {
      $or: [
        { position: { $in: myJobIds } }, 
        { positionId: { $in: myJobIds } },
        { job: { $in: myJobIds } },
        { createdBy: userId } // Or candidates added manually by me
      ]
    };

    // 3. Run counts on the Submission model
    // Using regex for status to match "Interview Scheduled", "Phone Screen", etc.
    const [totalSubmissions, interviewsScheduled, offersMade, hired] = await Promise.all([
      Submission.countDocuments(query),
      Submission.countDocuments({ ...query, status: { $regex: "Interview", $options: "i" } }),
      Submission.countDocuments({ ...query, status: "Offer" }),
      Submission.countDocuments({ ...query, status: "Hired" })
    ]);

    res.json({
      totalSubmissions,
      interviewsScheduled,
      offersMade,
      hired
    });
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    // Return zeros instead of crashing if something is wrong
    res.json({
      totalSubmissions: 0,
      interviewsScheduled: 0,
      offersMade: 0,
      hired: 0
    });
  }
});

module.exports = router;