// [File: arthi19042003/with-landing-page/With-landing-page-0f24402f43f461a8bca04af752e98da1034a70d5/server/routes/submissions.js]
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth"); // ✅ FIX: Corrected import
const mongoose = require("mongoose");
const Submission = require("../models/Submission");

// ====================================================
// GET all submissions
// ====================================================
router.get("/", protect, async (req, res) => {
  try {
    // ✅ FIX 1: Filter submissions by the logged-in user (recruiter)
    const submissions = await Submission.find({ submittedBy: req.user._id })
      // ✅ FIX 2: Populate the full candidate object
      .populate("candidate") 
      .populate("position", "title department") // Populate position info
      .populate("submittedBy", "name email role")
      .sort({ createdAt: -1 }); // ✅ correct field for sorting

    res.json(submissions);
  } catch (error) {
    console.error("❌ Error fetching submissions:", error.message);
    res.status(500).json({ message: "Server error fetching submissions" });
  }
});

// ====================================================
// CREATE new submission
// ====================================================
router.post("/", protect, async (req, res) => {
  try {
    const { candidate, position, status = "submitted", notes = "" } = req.body;

    if (!candidate || !position) {
      return res.status(400).json({ message: "Candidate and Position are required" });
    }

    const submission = new Submission({
      candidate,
      position,
      submittedBy: req.user._id, // ✅ matches model field
      status: status.toLowerCase(),
      notes,
    });

    await submission.save();

    const populatedSubmission = await Submission.findById(submission._id)
      .populate("candidate") // ✅ FIX: Populate full candidate
      .populate("position", "title department") // ✅ FIX: Populate position
      .populate("submittedBy", "name email role");

    res.status(201).json(populatedSubmission);
  } catch (error) {
    console.error("❌ Error creating submission:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate submission detected." });
    }

    res.status(500).json({ message: "Server error creating submission" });
  }
});

// ====================================================
// UPDATE submission status/details
// ====================================================
router.put("/:id", protect, async (req, res) => {
  try {
    const { status, notes, ...otherUpdates } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (status && status !== submission.status) {
      submission.status = status.toLowerCase();
      submission.notes = notes || submission.notes;
    }

    Object.assign(submission, otherUpdates);
    const updatedSubmission = await submission.save();

    const populatedSubmission = await Submission.findById(updatedSubmission._id)
      .populate("candidate") // ✅ FIX: Populate full candidate
      .populate("position", "title department") // ✅ FIX: Populate position
      .populate("submittedBy", "name email role");

    res.json(populatedSubmission);
  } catch (error) {
    console.error("❌ Error updating submission:", error.message);
    res.status(500).json({ message: "Server error updating submission" });
  }
});

// ====================================================
// DELETE submission
// ====================================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Submission.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({ message: "Submission deleted successfully", _id: req.params.id });
  } catch (error) {
    console.error("❌ Error deleting submission:", error.message);
    res.status(500).json({ message: "Server error deleting submission" });
  }
});

module.exports = router;