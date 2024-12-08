const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const RecipeHasCategory = sequelize.define('recipe_has_category', {
  recipe_id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Kolom foreign key pertama
  },
  category_id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Kolom foreign key kedua
  },
}, {
  tableName: 'recipe_has_category',  // Nama tabel yang sesuai di database
  timestamps: false, // Tidak ada createdAt atau updatedAt
});

module.exports = RecipeHasCategory;
