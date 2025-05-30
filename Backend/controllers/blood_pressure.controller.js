const BloodPressurePrediction = require("../models/BloodPressurePrediction");

exports.saveBloodPressurePrediction = async (req, res) => {
  try {
    const { userId, input, result } = req.body;

    if (!userId || !input || result === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const prediction = new BloodPressurePrediction({
      user: userId,
      input,
      result,
    });

    const saved = await prediction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving blood pressure prediction:", err);
    res.status(500).json({ message: "Error saving prediction" });
  }
};
