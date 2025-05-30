const express = require("express");
const router = express.Router();
const { saveDiabetesPrediction } = require("../controllers/diabetes.controller");

router.post("/save", saveDiabetesPrediction);

module.exports = router;
