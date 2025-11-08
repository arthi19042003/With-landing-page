// server/routes/positions.js
const express = require("express");
const router = express.Router();
const Position = require("../models/Position");
const auth = require("../middleware/auth"); // Import auth middleware

// ✅ NEW: Import new models and file system utils
const Invitation = require("../models/Invitation");
const SOW = require("../models/SOW");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ NEW: Setup multer for SOW uploads
const sowStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/sows';
    fs.mkdirSync(uploadDir, { recursive: true }); // Create dir if not exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + path.extname(file.originalname)),
});
const sowUpload = multer({ storage: sowStorage });


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
    const { title, department, project, organization, skills, description, status } = req.body;

    if (!title || !department) {
      return res.status(400).json({ message: "Title and Department are required" });
    }

    const newPosition = new Position({
      title,
      department,
      project,
      organization,
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


// ===========================
// ✅ NEW: Get single position details (for HM page)
// @access  Protected
// ===========================
router.get("/:id", auth, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    
    // Also find related SOWs and Invitations
    const invitations = await Invitation.find({ position: req.params.id })
      .populate("recruiter", "profile.firstName profile.lastName profile.agencyName")
      .sort({ createdAt: -1 });
      
    const sows = await SOW.find({ position: req.params.id })
      .populate("uploadedBy", "profile.firstName profile.lastName")
      .sort({ createdAt: -1 });

    res.json({ position, invitations, sows });
  } catch (error) {
    console.error("❌ Error fetching position:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// ✅ NEW: Invite agency to position
// @access  Protected
// ===========================
router.post("/:id/invite", auth, async (req, res) => {
  try {
    const { recruiterId } = req.body;
    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }
    
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    
    // Check for existing invite
    const existing = await Invitation.findOne({ position: req.params.id, recruiter: recruiterId });
    if (existing) {
      return res.status(400).json({ message: "This recruiter has already been invited." });
    }
    
    const invitation = new Invitation({
      position: req.params.id,
      recruiter: recruiterId,
      invitedBy: req.userId,
    });
    
    await invitation.save();
    const populatedInvite = await Invitation.findById(invitation._id)
                                    .populate("recruiter", "profile.firstName profile.lastName profile.agencyName");
                                    
    res.status(201).json({ message: "Invitation sent", invitation: populatedInvite });
    
  } catch (error) {
    console.error("❌ Error sending invitation:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// ✅ NEW: Upload SOW for position
// @access  Protected
// ===========================
router.post("/:id/sow", auth, sowUpload.single("sowFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "SOW file is required" });
    }
    
    const sow = new SOW({
      position: req.params.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.userId,
    });
    
    await sow.save();
    const populatedSow = await SOW.findById(sow._id)
                                .populate("uploadedBy", "profile.firstName profile.lastName");
                                
    res.status(201).json({ message: "SOW uploaded", sow: populatedSow });
    
  } catch (error) {
    console.error("❌ Error uploading SOW:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;