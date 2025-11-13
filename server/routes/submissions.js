// server/routes/submissions.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application"); // ✅ Save to Application model
const protect = require("../middleware/auth");

// ✅ POST - Handle Candidate Application
router.post("/", protect, async (req, res) => {
  try {
    const { jobId, positionTitle, resumeUrl, coverLetter } = req.body;
    const candidateId = req.user.id || req.user._id;
    const candidateName = req.user.name || req.user.firstName;
    const candidateEmail = req.user.email;

    // Create new Application (Using the HR Model)
    const newApplication = new Application({
      jobId: jobId, // Ensure your frontend sends 'jobId'
      position: positionTitle,
      candidateName: candidateName,
      email: candidateEmail,
      resumeUrl: resumeUrl, // Ensure frontend sends this
      status: "Applied",
      createdBy: candidateId, // Track who applied
      appliedAt: new Date()
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ GET - Candidate's own submissions
router.get("/my-submissions", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const subs = await Application.find({ createdBy: userId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;