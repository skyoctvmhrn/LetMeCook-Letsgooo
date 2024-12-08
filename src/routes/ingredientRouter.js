"use strict";  //biar lebih aman
const express = require('express');
const {getIngredients}=require('../controller/ingredientController.js')

const ingredientRouter = express.Router();

//Routenya jadi /api/articles
ingredientRouter.get('/ingredients', getIngredients);
module.exports=ingredientRouter;