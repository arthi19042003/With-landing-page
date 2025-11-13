// Corrected: server/models/Position.js
// This is a simple model definition without the extra database connection logic.

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PositionSchema = new Schema({
  title: { type: String, required: true },
  department: String,
  description: String,
  requiredSkills: [String],
  location: String,
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Use mongoose.model, not a custom connection model
module.exports = mongoose.model('Position', PositionSchema);