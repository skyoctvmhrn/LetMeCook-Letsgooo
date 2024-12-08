"use strict";
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Pastikan path benar
const Ingredient = require('./ingredient'); // Pastikan sudah mengimpor model lain yang terkait
const RecipeHasIngredient = require('./recipe_has_ingredient'); // Model penghubung

const Recipe = sequelize.define(
  'recipe',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_recipe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cooking_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prep_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serves: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'recipe',
    timestamps: false, 
  }
);

module.exports = Recipe;
