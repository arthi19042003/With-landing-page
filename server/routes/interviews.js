const express = require("express");
const router = express.Router();
const multer = require("multer");
const Interview = require("../models/Interview");

// ✅ File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Create interview
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.resume = req.file.filename;

    const interview = new Interview(data);
    await interview.save();

    // ✅ Notify Manager simulation
    if (data.notifyManager === "true" || data.notifyManager === true) {
      console.log(
        `📩 Manager notified: ${data.candidateFirstName} ${data.candidateLastName} (${data.jobPosition}) - Result: ${data.result}`
      );
    }

    res.status(201).json(interview);
  } catch (err) {
    console.error("Error saving interview:", err);
    res.status(500).json({ error: "Error saving interview" });
  }
});

// ✅ Get all interviews
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update interview
router.put("/:id", upload.single("resume"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.resume = req.file.filename;

    const updated = await Interview.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    // ✅ Notify Manager if requested
    if (data.notifyManager === "true" || data.notifyManager === true) {
      console.log(
        `📩 Manager notified (update): ${data.candidateFirstName} ${data.candidateLastName} (${data.jobPosition}) - Result: ${data.result}`
      );
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating interview" });
  }
});

// ✅ Delete interview
router.delete("/:id", async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Interview deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting interview" });
  }
});

module.exports = router;
