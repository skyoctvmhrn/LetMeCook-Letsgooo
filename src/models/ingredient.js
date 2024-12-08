// //class buat nyimpen ingredient.js
"use strict";
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 


const Ingredient = sequelize.define('ingredient', {
  ingredient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ingredient_name: {
    type: DataTypes.STRING,
    allowNull: false //biar gk ada duplicate items
  }
}, {
  tableName: 'ingredient',  //sesuai sama nama tabel di database
  timestamps: false, //gak simpen value created at dan updated  at
});
module.exports = Ingredient;
