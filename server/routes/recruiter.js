// server/routes/recruiter.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Candidate = require("../models/Candidate");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Message = require("../models/Message");

// ====================================================
// @route   POST /api/recruiter/submit
// @desc    Recruiter submits a candidate for a position
// @access  Protected (Recruiter)
// ====================================================
router.post("/submit", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      rate,
      currentLocation,
      availability,
      skypeId,
      githubProfile,
      linkedinProfile,
      positionId, // The ID of the position they are being submitted for
      hiringManagerId, // The ID of the manager to notify
    } = req.body;

    if (!email || !positionId || !firstName || !hiringManagerId) {
      return res.status(400).json({ message: "First Name, Email, Position, and Hiring Manager are required." });
    }

    // 1. Find or create the candidate
    let candidate = await Candidate.findOne({ email: email.toLowerCase() });
    if (!candidate) {
      candidate = new Candidate({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        rate,
        currentLocation,
        availability,
        skypeId,
        githubProfile,
        linkedinProfile,
        status: "Submitted",
        submittedByRecruiter: req.userId, // Link to the recruiter
      });
    } else {
      // If candidate exists, update their info
      candidate.set({
        firstName,
        lastName,
        phone,
        rate,
        currentLocation,
        availability,
        skypeId,
        githubProfile,
        linkedinProfile,
        status: "Submitted", // Reset status for new submission
        submittedByRecruiter: req.userId,
      });
    }
    await candidate.save();

    // 2. Check for duplicate submission (same candidate for same position)
    const existingSubmission = await Submission.findOne({
      candidate: candidate._id,
      position: positionId,
    });

    if (existingSubmission) {
      return res.status(409).json({ message: "This candidate has already been submitted for this position." });
    }

    // 3. Create the new Submission
    const submission = new Submission({
      candidate: candidate._id,
      position: positionId,
      submittedBy: req.userId, // The Recruiter's User ID
      status: "submitted",
    });
    await submission.save();

    // 4. Send a message to the Hiring Manager's Inbox
    const manager = await User.findById(hiringManagerId);
    if (manager) {
      const recruiter = await User.findById(req.userId);
      await Message.create({
        to: manager.email,
        from: recruiter.profile.agencyName || recruiter.email,
        subject: `New Candidate Submission: ${firstName} ${lastName}`,
        message: `${recruiter.profile.firstName || 'Recruiter'} has submitted ${firstName} ${lastName} for position ID ${positionId}.`,
        status: "unread",
      });
    }

    res.status(201).json({ message: "Candidate submitted successfully!", submission });

  } catch (error) {
    console.error("Recruiter submission error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ====================================================
// @route   GET /api/recruiter/managers
// @desc    Get all hiring managers for submission form
// @access  Protected (Recruiter)
// ====================================================
router.get("/managers", auth, async (req, res) => {
    try {
        const managers = await User.find({ role: 'hiringManager' }).select('profile.firstName profile.lastName email');
        res.json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;