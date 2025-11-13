const express = require("express");
const router = express.Router();
// ✅ Fix Import
const protect = require("../middleware/auth"); 

router.get("/", protect, (req, res) => {
    res.json({ message: "Agency routes working" });
});

module.exports = router;