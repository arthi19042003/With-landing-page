const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Position" },
  position: String, // Snapshot of the title
  candidateName: String,
  email: String,
  phone: String,
  resumeUrl: String,
  status: {
    type: String,
    enum: ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"],
    default: "Applied",
  },
  // For tracking interviews/communication
  interviews: [{
    date: Date,
    time: String,
    type: String, // e.g., "Phone", "Video", "Onsite"
    notes: String,
    status: { type: String, default: "Scheduled" }
  }],
  communication: [{
    from: String, // "candidate" or "hiringManager"
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  onboardingStatus: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
    default: "Pending" 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Hiring Manager ID
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);