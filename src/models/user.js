"use strict";
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Pastikan path benar
const Ingredient = require('./ingredient'); // Pastikan sudah mengimpor model lain yang terkait
const RecipeHasIngredient = require('./recipe_has_ingredient'); // Model penghubung

const User = sequelize.define(
  'user_id',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'recipe',
    timestamps: false, 
  }
);

module.exports = User;
