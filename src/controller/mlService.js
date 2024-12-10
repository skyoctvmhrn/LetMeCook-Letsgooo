const axios = require("axios");
const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const Category = require('../models/category');
const RecipeHasCategory = require('../models/recipe_has_category');
const RecipeHasIngredient = require('../models/recipe_has_ingredient');
const Ingredient = require('../models/ingredient');



// Fungsi untuk menangani prediksi

exports.predict = async (req, res) => {
  try {
    //Ingredients data yang diterima oleh user >> karena ini .data jadi waktu kirim json array harus dikasi index .data
    const ingredients = req.body.data;

    // Endpoint model ML di Cloud Run
    const mlModelUrl =
    "https://apimodelmachinelearning-1054843139157.asia-southeast2.run.app/predict";

    //Kirim request dengan method post
    const response = await axios.post(
      mlModelUrl,
      { data: ingredients },
      {
        headers: {
          "Content-Type": "application/json", // Content type for the data being sent
        },
      }
    );

    const tags = response.data.data; //Ambil list hasil prediksinya
    console.log("Ingredients:", ingredients); //buat checking di console udh bener blm
    console.log("Predicted Tags:", tags); //sama buat checking

    //Cari resep yang sesuai
    const recipes = await Recipe.findAll({
      include: [
        {
          model: Ingredient,
          attributes: ["ingredient_name"],
          through: {
            model: RecipeHasIngredient,
            attributes: ["stock", "unit"],
          },
        },
        {
          model: Category,
          attributes: ["category_name"],
          through: {
            model: RecipeHasCategory,
            attributes: [],
          },
        },
      ],
      where: {
        //cari info sesuai bahan yang dipunya dan kategori hasil prediksi
        [Op.and]: [
          {
            "$ingredients.ingredient_name$": {
              [Op.in]: ingredients, //ingredients yang diinput oleh user
            },
          },
          {
            "$categories.category_name$": {
              [Op.in]: tags, //kategori hasil prediksi
            },
          },
        ],
      },
      attributes: ["recipe_id", "name_recipe", "image"],
    });

    //Kasih exception klo gk ada resep yg ditemukan
    if (recipes.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No recipes found based on the selected ingredients and categories.",
        });
    }
    const result = recipes.map((recipe) => {
      const categoryList = recipe.categories.map(
        (category) => category.category_name
      ); //ubah kategori itu yg awalnya object jd list, di map dua kali krn dia object di dlm object

      return {
        recipe_id: recipe.recipe_id,
        name_recipe: recipe.name_recipe,
        image: recipe.image,
        categories: categoryList, //return nama kategorinya
      };
    });

    // Return the formatted recipes as a JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};