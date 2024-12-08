const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const RecipeHasIngredient = sequelize.define('recipe_has_ingredient', {
  recipe_id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Kolom foreign key pertama
  },
  ingredient_id_ingredient: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Kolom foreign key kedua
  },
  unit: {
    type: DataTypes.STRING(100), // Menyesuaikan tipe data kolom `unit`
    allowNull: true,
  },
  stock: {
    type: DataTypes.FLOAT,  // Menyesuaikan tipe data kolom `stock`
    allowNull: true,
  },
}, {
  tableName: 'recipe_has_ingredient',  // Nama tabel yang sesuai di database
  timestamps: false, // Tidak ada createdAt atau updatedAt
});

module.exports = RecipeHasIngredient;
