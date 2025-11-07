const express = require("express");
const router = express.Router();

let interviews = [
  { id: 1, candidate: "Amit Kumar", date: "2025-10-15", interviewer: "Renu", status: "Pending" },
  { id: 2, candidate: "Sara Lee", date: "2025-10-17", interviewer: "Kiran", status: "Completed" },
];

router.get("/", (req, res) => res.json(interviews));

module.exports = router;
