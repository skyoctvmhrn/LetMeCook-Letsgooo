const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const Ingredient = require("../models/ingredient");
const Inventory = require("../models/inventory");
//CODE UNTUK VALIDASI INPUTAN USER
const validate = require("../utils/validate"); // Pastikan path benar

// Ambil semua inventory beserta bahan
exports.getAllInventory = async (req, res) => {
  try {
    const user_id_user = req.params.user_id; // Ambil langsung user_id dari req.params
    console.log(user_id_user); // Debugging untuk memastikan nilainya benar

    // Ambil semua inventory
    const inventory = await Inventory.findAll({
      attributes: [
        "id_inventory",
        "ingredient_id_ingredient", // Foreign key to ingredient
        "ingredients_pic", // Menambahkan field ingredients_pic
        "stock",
        "unit",
        "expiry_date",
        "place",
        "user_id_user",
      ],
      where: {
        user_id_user: user_id_user, // Gunakan nilai user_id_user yang benar
      },
    });

    // Ambil daftar ingredient berdasarkan ingredient_id_ingredient yang ada di inventory
    const ingredientIds = inventory.map(
      (item) => item.ingredient_id_ingredient
    );
    const ingredients = await Ingredient.findAll({
      where: {
        ingredient_id: {
          [Op.in]: ingredientIds, // Ambil hanya ingredient yang ada di inventory
        },
      },
      attributes: ["ingredient_id", "ingredient_name"],
    });

    // Format data inventory dan ingredients dalam satu array
    const formattedData = inventory.map((item) => {
      const ingredient = ingredients.find(
        (ing) => ing.ingredient_id === item.ingredient_id_ingredient
      );

      return {
        id_inventory: item.id_inventory,
        ingredient_id: ingredient ? ingredient.ingredient_id : null,
        ingredient_name: ingredient ? ingredient.ingredient_name : null,
        ingredients_pic: item.ingredients_pic,
        user_id_user: item.user_id_user,
        stock: item.stock,
        unit: item.unit,
        expiry_date: item.expiry_date,
        place: item.place,
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Store inventory
exports.store = async (req, res) => {
  try {
    const { isValid, errors } = validate(req.body, {
      user_id_user: {
        check: (value) => typeof value === "number" && value >= 0,
        message: "user_id_user", //id user itu diambil dari user yang lagi login >> jd hrsnya diurus sama MD
      },
      name_ingredient: {
        check: (value) => typeof (value === "string" && value.trim() !== ""), //pake trim "" krn string ditandai ""
        message: "name_ingredient",
      },
      ingredients_pic: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "ingredient_pic",
      },
      buy_date: {
        check: (value) => !isNaN(Date.parse(value)),
        message: "buy_date",
      },
      stock: {
        check: (value) => typeof value === "number" && value >= 0,
        message: "stock",
      },
      unit: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "unit",
      },
      place: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "place",
      },
      expiry_date: {
        check: (value) => !isNaN(Date.parse(value)),
        message: "expiry_date",
      },
    });

    if (!isValid) {
      return res
        .status(400)
        .json({ message: Invalid or missing field ${errors.join(", ")} });
    }

    // Kalau sudah cek semua inputan, waktunya kita cari id :)
    const {
      name_ingredient,
      user_id_user,
      ingredients_pic,
      buy_date,
      stock,
      unit,
      place,
      expiry_date,
    } = req.body;

    // Cari ingredient berdasarkan nama
    let ingredient = await Ingredient.findOne({
      where: { ingredient_name: name_ingredient },
    });

    if (!ingredient) {
      //klo ingredient gak ditemukan, maka create ingredient tersebut
      await Ingredient.create({ ingredient_name: name_ingredient });
    }
    //setelah selesai store, maka jalankan lagi buat dapat id yang baru HAHAHAH
    ingredient = await Ingredient.findOne({
      where: { ingredient_name: name_ingredient },
    });
    // Setelah mendapatkan id ingredient, lanjutkan memasukkan data ke Inventory
    await Inventory.create({
      user_id_user: user_id_user,
      ingredients_pic: ingredients_pic,
      stock: stock,
      unit: unit,
      ingredient_id_ingredient: ingredient.ingredient_id,
      buy_date: buy_date,
      place: place,
      expiry_date: expiry_date,
    });

    return res.status(201).json({ message: "Inserted data successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Insert data failed" });
  }
};

//UPDATE BAHAN SECARA MANUAL
exports.updateManual = async (req, res) => {
  try {
    const id = req.params.id; // ID inventory yang dikirim oleh pengguna
    const { isValid, errors } = validate(req.body, {
      user_id_user: {
        check: (value) => typeof value === "number" && value >= 0,
        message: "user_id_user",
      },
      ingredient_id_ingredient: {
        check: (value) => typeof value === "number" && value >= 0,
        message: "ingredient_id_ingredient",
      },
      ingredients_pic: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "ingredients_pic",
      },
      buy_date: {
        check: (value) => !isNaN(Date.parse(value)),
        message: "buy_date",
      },
      stock: {
        check: (value) => typeof value === "number" && value >= 0,
        message: "stock",
      },
      unit: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "unit",
      },
      place: {
        check: (value) => typeof value === "string" && value.trim() !== "",
        message: "place",
      },
      expiry_date: {
        check: (value) => !isNaN(Date.parse(value)),
        message: "expiry_date",
      },
    });

    // Cek validasi
    if (!isValid) {
      return res
        .status(400)
        .json({ message: Invalid or missing field(s): ${errors.join(", ")} });
    }

    // Lakukan update pada tabel Inventory
    const [updatedRows] = await Inventory.update(req.body, {
      where: {
        id_inventory: id,
      },
    });

    // Cek apakah ada data yang diperbarui
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Inventory not found or no changes made" });
    }

    return res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};

//CODE UNTUK SEARCHING INVENTORY;
exports.searchInventoryByIngredient = async (req, res) => {
  try {
    const { query } = req.query; // Ambil parameter query dari URL

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    // Pencarian di Inventory berdasarkan ingredient_name
    const inventories = await Inventory.findAll({
      include: [
        {
          model: Ingredient,
          attributes: ["ingredient_name"], // Ambil hanya kolom ingredient_name
          where: {
            ingredient_name: {
              [Sequelize.Op.like]: %${query}%, // Pencarian menggunakan LIKE
            },
          },
          required: true, // Pastikan hanya data dengan ingredient yang cocok
        },
      ],
    });

    // Jika tidak ada hasil
    if (inventories.length === 0) {
      return res.status(404).json({
        message: "No inventory items found matching the ingredient name.",
      });
    }
    // Kembalikan data hasil pencarian
    const result = inventories.map((item) => {
      const inventory = item.toJSON(); // Pastikan data dalam bentuk JSON
      inventory.ingredient_name = item.ingredient.ingredient_name; // Salin ingredient_name ke objek luar
      delete inventory.ingredient; //Hapus aja properti object ingredient yang ada di luar
      return inventory;
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching inventory by ingredient name:", error); // Log error
    res.status(500).json({ message: "Internal server error" });
  }
};

//AMBIL DATA INVENTORY BERDASARKAN ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventoryId = req.params.id;

    const inventory = await Inventory.findOne({
      where: {
        id_inventory: inventoryId,
      },
      attributes: [
        "id_inventory",
        "ingredient_id_ingredient", // Foreign key to ingredient
        "stock",
        "unit",
        "expiry_date",
        "place",
        "user_id_user",
      ],
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const ingredient = await Ingredient.findOne({
      where: {
        ingredient_id: inventory.ingredient_id_ingredient,
      },
      attributes: ["ingredient_id", "ingredient_name"],
    });

    const formattedData = {
      id_inventory: inventory.id_inventory,
      ingredient_id: ingredient ? ingredient.ingredient_id : null,
      ingredient_name: ingredient ? ingredient.ingredient_name : null,
      user_id_user: inventory.user_id_user,
      stock: inventory.stock,
      unit: inventory.unit,
      expiry_date: inventory.expiry_date,
      place: inventory.place,
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching inventory by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//copy dar code ilham yay
exports.deleteInventory = async (req, res) => {
  try {
    const id = req.params.id;

    // Validasi jika ID kosong atau tidak valid
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid or missing inventory ID" });
    }

    // Cari item yang akan dihapus
    const existingItem = await Inventory.findOne({
      where: {
        id_inventory: id,
      },
    });

    // Jika item tidak ditemukan
    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Hapus item
    await Inventory.destroy({
      where: {
        id_inventory: id,
      },
    });

    // Response sukses
    return res
      .status(200)
      .json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error); // Log detail error
    return res.status(500).json({ message: "Failed to delete inventory item" });
  }
};
