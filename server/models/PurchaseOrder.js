const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    poId: { type: Number, required: true, unique: true },
    vendor: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
