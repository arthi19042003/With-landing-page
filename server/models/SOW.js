// server/models/SOW.js
const mongoose = require("mongoose");

const sowSchema = new mongoose.Schema({
  position: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Position", 
    required: true 
  },
  agency: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // Assumes agency is a Recruiter User
  }, 
  fileName: { 
    type: String, 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("SOW", sowSchema);