const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const Category = require('../models/category');
const RecipeHasCategory = require('../models/recipe_has_category');
const RecipeHasIngredient = require('../models/recipe_has_ingredient');
const Ingredient = require('../models/ingredient');
// Ambil semua resep beserta daftar kategorinya
exports.getAllRecipesWithCategory = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: {
                model: Category, //kolom yang mau diambil (hasil innerjoin)
                attributes: ['category_name'],  // Hanya mengambil nama bahan
            },
            attributes: ['name_recipe'],  // Hanya mengambil nama resep
        });
        // Proses dan format data sesuai kebutuhan >> di flatten jadi 1 dimensi
        //Langsung show 1 resep beserta semua kategorinya
        const formattedData = recipes.map(recipe => {
            return {
                recipe_name: recipe.name_recipe,
                category: recipe.categories.map(category => ({  // Corrected to 'categories' here
                    category_name: category.category_name,
                })),
            };
        });

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching recipes with ingredients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Filter resep dengan kategori tertentu
//Pake list of resep dari hasil filtering sebelumnya
//baru dipake skrg filtering ulang berdasarkan kategori tertentu
//Cari resep berdasarkan bahan yang diinputkan dengan lebih fleksibel
//Ini filter tags
exports.getRecipesByExactTags = async (req, res) => {
    try {
        const tags = req.body.tags; // Tags adalah array nama kategori

        if (!tags || tags.length === 0) {
            return res.status(400).json({ message: "Category's array is required" });
        }

        // Temukan resep berdasarkan nama kategori
        const recipes = await Recipe.findAll({
            include: [{
                model: Category,
                attributes: ['category_name'],
                through: {
                    attributes: [], // Jangan tampilkan data dari tabel relasi
                },
                where: {
                    category_name: {
                        [Op.in]: tags //cari semua data kategori yang cocok
                    }
                }
            }],
            attributes: ['recipe_id', 'name_recipe'],
        });

        // Filter untuk memastikan kategori resep persis sama dengan input tags
        const filteredRecipes = recipes.filter(recipe => {
            const recipeCategories = recipe.categories.map(cat => cat.category_name);
            return (
                recipeCategories.length === tags.length && // Jumlah kategori harus sama persis
                tags.every(tag => recipeCategories.includes(tag)) // Semua tags harus ada
            );
        });

        if (filteredRecipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found with the specified tags.' });
        }

        res.status(200).json(filteredRecipes);
    } catch (error) {
        console.error('Error fetching recipes by tags:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//INI BUAT DAPET DETAIL RESEPPP
exports.getRecipeDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const recipeDetails = await Recipe.findOne({
            where: { recipe_id: id },
            include: [
                {
                    model: Ingredient,
                    attributes: ['ingredient_name'],
                    through: {
                        model: RecipeHasIngredient,
                        attributes: ['stock', 'unit']
                    }
                },
                {
                    model: Category,
                    attributes: ['category_name'],
                    through: {
                        model: RecipeHasCategory,
                        attributes: []
                    }
                }
            ],
            attributes: ['recipe_id', 'name_recipe', 'cooking_method', 'serves', 'prep_time', 'image']
        });
        //Ubah list of dictionary jadi list of string dgn mapping
        //Klo di mapping itu 1 object, berubah jadi xxx sesuai yang kita state
        const categoryList = recipeDetails.categories.map(category => category.category_name);
        // Extracting ingredient details
        const ingredientList = recipeDetails.ingredients.map(ingredient => {
            const { stock, unit } = ingredient.recipe_has_ingredient;
            const ingredientName = ingredient.ingredient_name;
            //atur jadi list bahan kayak di resep biasanya
            return (stock !== null && unit !== null)
                ? `${stock} ${unit} ${ingredientName}`
                : ingredientName; //klo quantity sama unit gak ada, maka display nama ingredientsnya aja HEHE
        });
        //KIRIM HASIL FORMATTING
        const response = {
            recipe_id: recipeDetails.recipe_id,
            name_recipe: recipeDetails.name_recipe,
            ingredients: ingredientList,
            cooking_method: recipeDetails.cooking_method,
            serves: recipeDetails.serves,
            prep_time: recipeDetails.prep_time,
            image: recipeDetails.image,
            categories: categoryList,
        };

        //kirim dalam bentuk jsonnn
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching recipes by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};









