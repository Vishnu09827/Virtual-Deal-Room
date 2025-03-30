const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  status: { type: String, enum: ["pending", "in_progress", "completed", "cancelled"], default: "pending" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Deal", DealSchema);