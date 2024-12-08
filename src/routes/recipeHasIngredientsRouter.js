"use strict";  //biar lebih aman
const express = require('express');
const {getAllRecipesWithIngredients}=require('../controller/recipeHasIngredientController.js');
const {getRecipesByExactIngredients}=require('../controller/recipeHasIngredientController.js');
const {updateInventoryAfterCooking}=require('../controller/recipeHasIngredientController.js');
const {getRecipeByIdWithIngredients}=require('../controller/recipeHasIngredientController.js');
const recipeHasIngredientRouter = express.Router();
recipeHasIngredientRouter.get('/recipe-ingredients', getAllRecipesWithIngredients);
recipeHasIngredientRouter.post('/cariresep', getRecipesByExactIngredients);
recipeHasIngredientRouter.post('/update-inventory', updateInventoryAfterCooking);
recipeHasIngredientRouter.get('/recipe-ingredients/:id', getRecipeByIdWithIngredients);
module.exports=recipeHasIngredientRouter;