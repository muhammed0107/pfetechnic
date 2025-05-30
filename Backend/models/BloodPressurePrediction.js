const mongoose = require("mongoose");

const BloodPressurePredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  input: {
    age: Number,
    systolic_pressure: Number,
    diastolic_pressure: Number
  },
  result: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BloodPressurePrediction", BloodPressurePredictionSchema);
