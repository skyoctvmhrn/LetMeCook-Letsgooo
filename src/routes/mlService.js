const express = require("express");
const router = express.Router();
const mlController = require("../controller/mlService");

// Route untuk prediksi
router.post("/predict", mlController.predict);

module.exports = router;
