"use strict";
const Ingredient = require("../models/ingredient.js");
exports.getIngredients=async (req, res) => {
      try {
        //baca semua data artikel
        const ingredients = await Ingredient.findAll();
        res.json(ingredients);
      } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data ingredients' });
      }
}


  