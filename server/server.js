// ===============================================
// Smart Submissions Server
// ===============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// ===============================================
// Initialize App
// ===============================================
const app = express();

// ===============================================
// Middleware
// ===============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================================
// MongoDB Connection
// ===============================================
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ===============================================
// Import Middleware
// ===============================================
const protect = require("./middleware/auth");

// ===============================================
// Public Routes
// ===============================================
app.use("/api/auth", require("./routes/auth"));

// ===============================================
// Candidate Routes
// ===============================================
app.use("/api/profile", require("./routes/profile"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/interview", require("./routes/interviewRoutes"));

// ===============================================
// Employer Routes
// ===============================================
app.use("/api/employer", require("./routes/employerRoutes"));

// ===============================================
// Hiring Manager Routes ✅ (Correct & Working)
// ===============================================
app.use("/api/hiringManager", require("./routes/managerRoutes"));

// ===============================================
// Recruiter Routes (Protected)
// ===============================================
app.use("/api/recruiter", protect, require("./routes/recruiter")); // ✅ NEW ROUTE

// ===============================================
// Protected Routes (Require Authentication)
// ===============================================
app.use("/api/inbox", protect, require("./routes/inbox"));
app.use("/api/positions", protect, require("./routes/positions"));
app.use("/api/candidates", protect, require("./routes/candidates"));
app.use("/api/interviews", protect, require("./routes/interviews"));
app.use("/api/onboarding", protect, require("./routes/onboarding"));
app.use("/api/po", protect, require("./routes/po"));
app.use("/api/dashboard", protect, require("./routes/dashboard"));
app.use("/api/submissions", protect, require("./routes/submissions"));


// ===============================================
// Health Check Route
// ===============================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 Smart Submissions API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ===============================================
// 404 Handler
// ===============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================================
// Global Error Handler
// ===============================================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================================
// Start Server
// ===============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Smart Submissions Server running on port ${PORT}`);
});