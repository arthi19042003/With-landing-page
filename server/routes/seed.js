// server/routes/seed.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Position = require("../models/Position");
const Submission = require("../models/Submission");
const mongoose = require("mongoose");

// Seed route
router.get("/", async (req, res) => {
  try {
    console.log("🧹 Clearing old sample data...");
    await User.deleteMany({});
    await Candidate.deleteMany({});
    await Position.deleteMany({});
    await Submission.deleteMany({});

    console.log("🌱 Inserting fresh sample data...");

    // 1️⃣ Create a manager user
    const manager = await User.create({
      name: "John Manager",
      email: "manager@example.com",
      password: "password123",
      role: "manager",
    });

    console.log("✅ Manager created:", manager._id);

    // 2️⃣ Create candidates
    const candidates = await Candidate.insertMany([
      { name: "Alice Johnson", email: "alice@example.com", phone: "1234567890" },
      { name: "Bob Smith", email: "bob@example.com", phone: "9876543210" },
    ]);
    console.log("✅ Candidates created:", candidates.length);

    // 3️⃣ Create positions
    const positions = await Position.insertMany([
      { title: "Frontend Developer", department: "Engineering" },
      { title: "Backend Developer", department: "Engineering" },
    ]);
    console.log("✅ Positions created:", positions.length);

    // 4️⃣ Create submissions
    if (!manager || !manager._id) {
      throw new Error("❌ Manager ID is missing, cannot seed submissions.");
    }

   // Assuming you already created a user earlier in the seeding script:
const user = await User.create({
  name: "Admin User",
  email: "admin@example.com",
  password: "123456",
  role: "admin",
});

await Submission.create([
  {
    candidate: candidate1._id,
    position: position1._id,
    status: "submitted",
    submittedBy: user._id, // ✅ add this line
  },
  {
    candidate: candidate2._id,
    position: position2._id,
    status: "reviewed",
    submittedBy: user._id, // ✅ add this line
  },
]);


    console.log("✅ Submissions created successfully");
    res.status(200).json({ message: "🌱 Sample data seeded successfully!" });
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
