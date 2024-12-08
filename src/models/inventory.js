//inventory itu basisnya dari many to many user dan ingredients
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 
const User = require('../models/user.js'); 
const Ingredient = require('../models/ingredient.js'); 
const Inventory = sequelize.define('inventory', {
  user_id_user: {
    type: DataTypes.INTEGER
  },
  ingredient_id_ingredient: {
    type: DataTypes.INTEGER
  },
  id_inventory: {
    type: DataTypes.INTEGER,
    primaryKey:true,
  },
  ingredients_pic: {
    type: DataTypes.STRING
  },
  buy_date: {
    type: DataTypes.DATEONLY
  },
  stock: {
    type: DataTypes.INTEGER
  },
  unit: {
    type: DataTypes.STRING
  },
  place: {
    type: DataTypes.STRING
  },
  expiry_date: {
    type: DataTypes.DATEONLY
  },
}, {
  tableName: 'inventory',  
  timestamps: false, 
});
Inventory.belongsTo(User, { foreignKey: 'user_id_user' });  // Menunjukkan Inventory milik User
Inventory.belongsTo(Ingredient, { foreignKey: 'ingredient_id_ingredient' });  // Menunjukkan Inventory berisi Ingredient
module.exports = Inventory;
