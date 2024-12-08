// Setelah semua model didefinisikan, buat relasi
const Recipe = require('./recipe.js');
const Ingredient = require('./ingredient.js');
const RecipeHasIngredient = require('./recipe_has_ingredient.js');
const Category = require('./category.js');
const RecipeHasCategory = require('./recipe_has_category.js');
const Inventory = require('./inventory.js');
const User = require('./user.js');

// Mendeklarasikan relasi antar model
const setupBahanResepAssociations = () => {
  // Relasi antara Recipe dan Ingredient melalui RecipeHasIngredient
  Recipe.belongsToMany(Ingredient, {
    through: RecipeHasIngredient,
    foreignKey: 'recipe_id_recipe', // Kolom penghubung di RecipeHasIngredient
    otherKey: 'ingredient_id_ingredient', // Kolom penghubung di RecipeHasIngredient
  });

  Ingredient.belongsToMany(Recipe, {
    through: RecipeHasIngredient,
    foreignKey: 'ingredient_id_ingredient', // Kolom penghubung di RecipeHasIngredient
    otherKey: 'recipe_id_recipe', // Kolom penghubung di RecipeHasIngredient
  });
};
// Mendeklarasikan relasi antar model
const setupKategoriResepAssociations = () => {
//RELASI ANTARA RESEP DAN CATEGORY
  // Relasi antara Recipe dan Ingredient melalui RecipeHasIngredient
  Recipe.belongsToMany(Category, {
    through: RecipeHasCategory,
    foreignKey: 'recipe_id_recipe', // Kolom penghubung di RecipeHasIngredient
    otherKey: 'category_id_category', // Kolom penghubung di RecipeHasIngredient
  });

  Category.belongsToMany(Recipe, {
    through: RecipeHasCategory,
    foreignKey: 'category_id_category', // Kolom penghubung di RecipeHasIngredient
    otherKey: 'recipe_id_recipe', // Kolom penghubung di RecipeHasIngredient
  });
  };


module.exports = {setupBahanResepAssociations,setupKategoriResepAssociations};

