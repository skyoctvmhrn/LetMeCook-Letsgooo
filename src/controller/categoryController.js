"use strict";
const Category = require("../models/category.js"); //panggil modelnya (class >> isi properties)
exports.getCategories=async (req, res) => {
      try {
        //baca semua data artikel
        const categories = await Category.findAll();
        res.json(categories);
      } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data kategori' });
      }
    }
  