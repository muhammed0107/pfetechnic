const express = require("express");
const router = express.Router();
const { saveBloodPressurePrediction } = require("../controllers/blood_pressure.controller");

// Route POST
router.post("/save1", saveBloodPressurePrediction);

module.exports = router;  // ✅ important
