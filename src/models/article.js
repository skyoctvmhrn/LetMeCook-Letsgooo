"use strict";
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const Article = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT, // Ganti ke TEXT jika body-nya bisa panjang
    allowNull: false
  }
}, {
  tableName: 'article',  // Nama tabel di database
  timestamps: false,    // Nonaktifkan kolom createdAt dan updatedAt
});

module.exports = Article; // Ekspor model