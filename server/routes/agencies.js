const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose"); 
const Invitation = require("../models/Invitation");
const protect = require("../middleware/auth");

// ✅ CRITICAL FIX: Explicitly require the User model file HERE
// This forces it to load and register with Mongoose before we use it.
require("../models/User"); 
const User = mongoose.model("User"); // Now this line will work safely

// @route   POST /api/agencies/invite
// @desc    Invite an agency or recruiter
router.post("/invite", protect, async (req, res) => {
  try {
    const { email, role } = req.body;
    const createdBy = req.user.id || req.user._id;

    // Check if user already exists
    const existingUser = await User.findOne({ email }); // This will no longer crash
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check for existing pending invite
    const existingInvite = await Invitation.findOne({ email, status: "Pending" });
    if (existingInvite) {
      return res.status(400).json({ message: "Invite already pending for this email" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const invite = new Invitation({
      email,
      role,
      token,
      createdBy,
    });
    await invite.save();

    const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/register-invite/${token}`;
    console.log(`✅ Invite sent to ${email}: ${inviteLink}`);
    
    res.status(201).json({ message: "Invite sent successfully" });
  } catch (err) {
    console.error("❌ Error sending invite:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// @route   GET /api/agencies/invites
// @desc    Get all invites sent by the manager
router.get("/invites", protect, async (req, res) => {
  try {
    const invites = await Invitation.find({ createdBy: (req.user.id || req.user._id) }).sort({ createdAt: -1 });
    res.json(invites);
  } catch (err) {
    console.error("Error fetching invites:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/agencies/invite/:id
// @desc    Delete an invite
router.delete("/invite/:id", protect, async (req, res) => {
  try {
    const invite = await Invitation.findOneAndDelete({
      _id: req.params.id,
      createdBy: (req.user.id || req.user._id),
    });
    if (!invite) return res.status(404).json({ message: "Invite not found" });
    res.json({ message: "Invite deleted" });
  } catch (err) {
    console.error("Error deleting invite:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/agencies/resend/:id
// @desc    Resend an invite
router.post("/resend/:id", protect, async (req, res) => {
  try {
    const invite = await Invitation.findOne({
      _id: req.params.id,
      createdBy: (req.user.id || req.user._id),
    });
    if (!invite) return res.status(44).json({ message: "Invite not found" });
    if (invite.status === "Accepted") {
      return res.status(400).json({ message: "Invite already accepted" });
    }

    const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/register-invite/${invite.token}`;
    console.log(`Resending invite to ${invite.email}: ${inviteLink}`);

    res.json({ message: "Invite resent" });
  } catch (err) {
    console.error("Error resending invite:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/agencies/register
// @desc    Agency/Recruiter registers using invite token
router.post("/register", async (req, res) => {
  try {
    const { token, name, password } = req.body;
    const invite = await Invitation.findOne({ token, status: "Pending" });
    if (!invite) {
      return res.status(400).json({ message: "Invalid or expired invite token" });
    }

    let user = await User.findOne({ email: invite.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name: name || invite.email, // Add name field
      email: invite.email,
      password, 
      role: invite.role.toLowerCase(), 
    });
    
    await user.save();

    invite.status = "Accepted";
    await invite.save();

    res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (err) {
    console.error("Error in agency registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;