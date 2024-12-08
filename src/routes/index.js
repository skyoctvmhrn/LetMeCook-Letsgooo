"use strict";
const express = require("express");
const articleRouter = require("./articleRoutes.js");
const ingredientRouter = require("./ingredientRouter.js");
const categoryRouter = require("./categoryRouter.js");
const recipeRouter = require("./recipeRouter.js");
const recipeHasIngredientRouter = require("./recipeHasIngredientsRouter.js");
const recipeHasCategoryRouter = require("./recipeHasCategoryRouter.js");
const inventoryRouter = require("./inventoryRouter.js");
const serviceRouter = require("./mlService.js");

const router = express();

//atur semua router disini >> nanti dia klo di postman jadi /api/xxx >> xxx sesesuai apa yg dideclare di route msg"
router.use("/api", articleRouter);
router.use("/api", ingredientRouter);
router.use("/api", recipeRouter);
router.use("/api", categoryRouter);
router.use("/api", recipeHasIngredientRouter);
router.use("/api", recipeHasCategoryRouter);
router.use("/api", inventoryRouter);
router.use("/api", serviceRouter);

module.exports = router;
