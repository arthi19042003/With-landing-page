// server/models/PurchaseOrder.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseOrderSchema = new Schema({
  poNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  candidateName: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  agencyName: { 
    type: String 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Draft", "Sent", "Paid", "Cancelled"], 
    default: "Draft" 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);