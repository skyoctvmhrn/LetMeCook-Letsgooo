"use strict"; //biar lebih aman
const express = require("express");
const {
  getAllRecipesWithCategory,
} = require("../controller/recipeHasCategoryController.js");
const {
  getRecipesByExactTags,
} = require("../controller/recipeHasCategoryController.js");
const {
  getRecipeDetails,
} = require("../controller/recipeHasCategoryController.js");
const recipeHasCategoryRouter = express.Router();

recipeHasCategoryRouter.get("/recipe-category", getAllRecipesWithCategory);
recipeHasCategoryRouter.post("/filter-tags", getRecipesByExactTags);
recipeHasCategoryRouter.get("/recipe-details/:id", getRecipeDetails);

module.exports = recipeHasCategoryRouter;
