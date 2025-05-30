const mongoose = require("mongoose");

const DiabetesPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  input: {
    pregnancies: Number,
    glucose: Number,
    blood_pressure: Number,
    skin_thickness: Number,
    insulin: Number,
    bmi: Number,
    diabetes_pedigree: Number,
    age: Number
  },
  result: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DiabetesPrediction", DiabetesPredictionSchema);
