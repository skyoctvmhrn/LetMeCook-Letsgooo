"use strict";  //biar lebih aman
const express = require('express');
const {getRecipes}=require('../controller/recipeController.js');
const {searchRecipe}=require('../controller/recipeController.js');
const {getRecipeById}=require('../controller/recipeController.js');
const recipeRouter = express.Router();

//Routenya jadi /api/articles
recipeRouter.get('/recipes', getRecipes);
recipeRouter.get('/search',searchRecipe);
recipeRouter.get('/recipes/:id', getRecipeById);
module.exports=recipeRouter;