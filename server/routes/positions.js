const express = require("express");
const router = express.Router();
const Position = require("../models/Position");
const auth = require("../middleware/auth"); // Import auth middleware

// ===========================
// @route   GET /api/positions
// @desc    Get all positions
// @access  Protected
// ===========================
router.get("/", auth, async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    console.error("❌ Error fetching positions:", error.message);
    res.status(500).json({ message: "Server error while fetching positions" });
  }
});

// ===========================
// @route   POST /api/positions
// @desc    Create a new position
// @access  Protected
// ===========================
router.post("/", auth, async (req, res) => {
  try {
    // ✅ FIX: Destructure all the fields from the form
    const { title, department, project, organization, skills, description, status } = req.body;

    // ✅ FIX: Validate for title and department (instead of openings)
    if (!title || !department) {
      return res.status(400).json({ message: "Title and Department are required" });
    }

    const newPosition = new Position({
      title,
      department,
      project,
      organization,
      // Handle skills as an array
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      description,
      status: status || "open",
    });

    const savedPosition = await newPosition.save();
    res.status(201).json(savedPosition);
  } catch (error) {
    console.error("❌ Error creating position:", error.message);
    res.status(500).json({ message: "Server error while creating position" });
  }
});

module.exports = router;