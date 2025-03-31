const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  price: Number,
  currentPrice: Number,
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  documents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Document",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deal", DealSchema);
