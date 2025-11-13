const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Position = require("../models/Position");
const protect = require("../middleware/auth");

// ✅ GET all applications (Filtered by Manager's Jobs)
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // 1. Find all jobs created by this manager
    const myJobs = await Position.find({ createdBy: userId }).select("_id");
    const myJobIds = myJobs.map(job => job._id);

    // 2. Find applications for those jobs OR applications manually created by this manager
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
    const history = await Application.find({
      email: req.params.email
    }).sort({ appliedAt: -1 });
    
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// 🟢 NEW: Hire & Reject Logic (Connects to Onboarding)
// ============================================================

// ✅ PUT - Reject an application
router.put("/:id/reject", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "Rejected";
    await application.save();
    
    res.json({ message: "Application rejected", application });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT - Hire a candidate (This STARTS the Onboarding process)
router.put("/:id/hire", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 1. Update Status
    application.status = "Hired";
    
    // 2. Trigger Onboarding
    // Setting this to "Pending" makes it appear in the Onboarding Dashboard
    application.onboardingStatus = "Pending"; 
    
    await application.save();
    
    res.json({ message: "Candidate hired! Onboarding started.", application });
  } catch (err) {
    console.error("Error hiring application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST - Send a message (For the Inbox feature)
router.post("/:id/message", protect, async (req, res) => {
  try {
    const { message, from } = req.body;
    const application = await Application.findById(req.params.id);
    
    if (!application) return res.status(404).json({ message: "App not found" });

    application.communication.push({
      from: from || "Hiring Manager",
      message,
      timestamp: new Date()
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;