"use strict";
const Sequelize = require('sequelize');
const Recipe = require("../models/recipe.js"); //panggil modelnya (class >> isi properties)
const Category = require("../models/category.js");
//Dapatkan semua daftar resep
exports.getRecipes=async (req, res) => {
      try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
      } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data resep' });
      }
}


// Pencarian resep berdasarkan nama doang
exports.searchRecipe = async (req, res) => {
  try {
    const { query } = req.query; // Ambil parameter query dari URL

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const recipes = await Recipe.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            name_recipe: {
              [Sequelize.Op.like]: `%${query}%`, // Pencarian berdasarkan nama resep
            },
          },
        ],
      }
    });

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found matching the query." });
    }

    res.status(200).json(recipes); // Kembalikan hasil
  } catch (error) {
    console.error("Error fetching recipes:", error); // Log error
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
      const recipeId = req.params.id;
      const recipe = await Recipe.findByPk(recipeId);
      if (recipe) {
          res.json(recipe);
      } else {
          res.status(404).json({ message: 'Resep tidak ditemukan' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data resep' });
  }
};




  