const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const RecipeHasIngredient = require('../models/recipe_has_ingredient');
const Inventory = require('../models/inventory');
// Ambil semua resep beserta daftar bahannya
exports.getAllRecipesWithIngredients = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: {
                model: Ingredient,
                attributes: ['ingredient_name'],
                through: {
                    attributes: ['stock', 'unit'],
                },
            },
            attributes: ['name_recipe'],
        });

        const formattedData = recipes.map(recipe => {
            return {
                recipe_name: recipe.name_recipe,
                ingredients: recipe.ingredients.map(ingredient => ({
                    ingredient_name: ingredient.ingredient_name,
                    stock: ingredient.recipe_has_ingredient.stock,
                    unit: ingredient.recipe_has_ingredient.unit,
                })),
            };
        });

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching recipes with ingredients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cari resep berdasarkan bahan yang diinputkan dengan lebih fleksibel
exports.getRecipesByExactIngredients = async (req, res) => {
    try {
        const ingredientIds = req.body.ingredients;  // Inputan bahan berdasarkan ID seperti ["16", "17", "18"]

        if (!ingredientIds || ingredientIds.length === 0) {
            return res.status(400).json({ message: "Ingredient IDs array is required" });
        }

        // Convert ingredients to integers if they are in string format
        const ingredientIdsInt = ingredientIds.map(id => parseInt(id, 10));

        // Cari resep yang mengandung bahan berdasarkan ingredient_id_ingredient yang sesuai dengan inputan pengguna
        const recipes = await Recipe.findAll({
            include: [{
                model: Ingredient,
                attributes: ['ingredient_id'],  // Mengambil ID bahan dari tabel ingredient
                through: {
                    model: RecipeHasIngredient,
                    attributes: ['ingredient_id_ingredient', 'stock', 'unit'],  // Mengambil kolom yang benar dari pivot table
                    where: {
                        ingredient_id_ingredient: {
                            [Op.in]: ingredientIdsInt  // Filter berdasarkan ID bahan yang diinputkan
                        }
                    }
                }
            }],
            attributes: ['name_recipe'],
        });

        // Filter resep untuk memastikan hanya yang mengandung bahan inputan dan tidak ada bahan lain
        const filteredRecipes = recipes.filter(recipe => {
            const ingredientIdsInRecipe = recipe.ingredients.map(ingredient => ingredient.recipe_has_ingredient.ingredient_id_ingredient);
            return (
                ingredientIdsInRecipe.length === ingredientIdsInt.length &&  // Jumlah bahan harus sama
                ingredientIdsInRecipe.every(id => ingredientIdsInt.includes(id)) &&  // Semua bahan di resep harus ada di input
                ingredientIdsInt.every(id => ingredientIdsInRecipe.includes(id))  // Semua bahan di input harus ada di resep
            );
        });

        // Jika tidak ada resep yang cocok
        if (filteredRecipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found with the specified ingredients.' });
        }

        res.status(200).json(filteredRecipes);
    } catch (error) {
        console.error('Error fetching recipes by ingredients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update Inventory Berdasarkan apa Yang Dimasak
//Klo dia gk cukup muncul exception, SO CANNOT COOK
exports.updateInventoryAfterCooking = async (req, res) => {
    try {
        const { user_id_user, recipe_id } = req.body;

        //Ambil daftar resep dan daftar bahannya
        const recipe = await Recipe.findOne({
            where: { recipe_id },
            include: [{
                model: Ingredient,
                attributes: ['ingredient_id', 'ingredient_name'],
                through: {
                    model: RecipeHasIngredient,
                    attributes: ['stock', 'unit'],
                },
            }],
        });

        //Cek apakah resep ada atau gak
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        //Cari semua inventory berdasarkan id user
        //dimana inventory itu mengandung semua bahan yg dipunya sama resep
        const inventory = await Inventory.findAll({
            where: {
                user_id_user, // Filter by user_id_user
                ingredient_id_ingredient: recipe.ingredients.map(ingredient => ingredient.ingredient_id), 
            },
        });

        // console.log("User inventory fetched successfully:", inventory.map(i => i.ingredient_id_ingredient));

        // Buat map of inventory 
        let inventoryMap = {};
        for (let i = 0; i < inventory.length; i++) {
            let item = inventory[i];
            inventoryMap[item.ingredient_id_ingredient] = item;
        }

        //Looping tiap resep dan compare stocknya
        for (let i = 0; i < recipe.ingredients.length; i++) {
            let ingredient = recipe.ingredients[i];
            let inv = inventoryMap[ingredient.ingredient_id];

            console.log(`Processing ingredient: ${ingredient.ingredient_name}`);

            if (inv) {
                let recipeStock = ingredient.recipe_has_ingredient.stock; // Stock from the recipe
                let unit = ingredient.recipe_has_ingredient.unit; // Unit of the ingredient

                console.log(`Stock from recipe: ${recipeStock}, Unit: ${unit}`);

                // If stock or unit is missing, skip this ingredient
                if (recipeStock == null || unit == null) {
                    console.log(`Skipping ${ingredient.ingredient_name} due to missing stock or unit.`);
                    continue;
                }

                // Convert recipe stock to the proper quantity based on the unit
                let reducedStock = recipeStock;
                switch (unit) {
                    case "tablespoon":
                        reducedStock *= 15;
                        break;
                    case "cup":
                        reducedStock *= 236.5;
                        break;
                    case "teaspoon":
                        reducedStock *= 5.69;
                        break;
                    case "ounce":
                        reducedStock *= 28.35;
                        break;
                    case "pinch":
                        reducedStock *= 0.35;
                        break;
                    case "lb":
                        reducedStock *= 453.6;
                        break;
                    case "pint":
                        reducedStock *= 400;
                        break;
                    case "pound":
                        reducedStock *= 500;
                        break;
                    case "large":
                        reducedStock *= 1;
                        break;
                    case "medium":
                        reducedStock *= 1;
                        break;
                    case "small":
                        reducedStock *= 1;
                        break;
                    case "can":
                        reducedStock *= 1;
                        break;
                    case "gram":
                        reducedStock *=1;
                    case "ml":
                        reducedStock*=1;
                    default:
                        reducedStock *= 0; //klo selain di list dia dikali 0, alias user harus update manual
                        break; //it applies for items like cloves dll yg susah buat diukur
                }

                // Step 5: Check if the inventory stock is sufficient
                let updatedStock = inv.stock - reducedStock;

                console.log(`Inventory stock: ${inv.stock}`);
                console.log(`Stock to be deducted: ${reducedStock}`);
                console.log(`Updated inventory stock: ${updatedStock}`);

                if (updatedStock < 0) {
                    // If inventory stock is not enough
                    return res.status(400).json({
                        message: `Not enough stock for ${ingredient.ingredient_name}. Cannot cook this recipe.`,
                    });
                }

                // Step 6: If the stock is sufficient, update the inventory
                await Inventory.update({ stock: updatedStock }, {
                    where: { id_inventory: inv.id_inventory },
                });

            } else {
                // If the ingredient is not found in the user's inventory
                return res.status(404).json({
                    message: `Ingredient ${ingredient.ingredient_name} not found in user inventory.`,
                });
            }
        }

        // Step 7: If all ingredients have been successfully processed and inventory updated, return success
        res.status(200).json({ message: "Stock successfully updated after cooking." });

    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Ambil resep berdasarkan ID beserta daftar bahannya
exports.getRecipeByIdWithIngredients = async (req, res) => {
    try {
        const recipeId = req.params.id; // Ambil ID resep dari parameter URL

        const recipe = await Recipe.findOne({
            where: { recipe_id: recipeId },
            include: {
                model: Ingredient,
                attributes: ['ingredient_name'],
                through: {
                    attributes: ['stock', 'unit'],
                },
            },
            attributes: ['name_recipe'],
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const formattedData = {
            recipe_name: recipe.name_recipe,
            ingredients: recipe.ingredients.map(ingredient => ({
                ingredient_name: ingredient.ingredient_name,
                stock: ingredient.recipe_has_ingredient.stock,
                unit: ingredient.recipe_has_ingredient.unit,
            })),
        };

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching recipe with ingredients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
