// server/routes/inbox.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ Get messages for the logged-in user
router.get("/", async (req, res) => {
  try {
    const email = req.user?.email; // email comes from protect middleware (token)
    if (!email) {
      return res.status(401).json({ message: "Unauthorized: missing user email" });
    }

    console.log("📬 Fetching inbox messages for:", email);

    const messages = await Message.find({ to: email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Inbox fetch error:", err.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
