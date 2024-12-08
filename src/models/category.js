"use strict";
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const Category = sequelize.define('category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'category',  
  timestamps: false,       
});

module.exports = Category;