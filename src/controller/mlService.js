const axios = require("axios");

// Endpoint model ML di Cloud Run
const mlModelUrl =
  "https://apimodelmachinelearning-1054843139157.asia-southeast2.run.app";

// Fungsi untuk menangani prediksi
exports.predict = async (req, res) => {
  try {
    // Ambil input data dari permintaan
    const inputData = req.body.input;

    // Kirimkan data ke model ML di Cloud Run
    const response = await axios.post(mlModelUrl, { input: inputData });

    // Kembalikan hasil prediksi ke aplikasi mobile
    res.json(response.data);
  } catch (error) {
    console.error("Error saat memanggil model ML:", error);
    res.status(500).json({ error: "Error pada model ML" });
  }
};
