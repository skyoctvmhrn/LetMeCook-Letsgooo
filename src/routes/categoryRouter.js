"use strict"; //biar lebih aman
const express = require("express");
const { getCategories } = require("../controller/categoryController.js");

const categoryRouter = express.Router();

//Routenya jadi /api/articles
categoryRouter.get("/categories", getCategories);

module.exports = categoryRouter;
