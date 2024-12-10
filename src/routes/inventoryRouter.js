"use strict";  //biar lebih aman
const express = require('express');
const {getAllInventory, destroy}=require('../controller/inventoryController.js')
const {updateManual}=require('../controller/inventoryController.js')
const {searchInventoryByIngredient}=require('../controller/inventoryController.js')
const {getInventoryById}=require('../controller/inventoryController.js')
const {deleteInventory}=require('../controller/inventoryController.js')
const inventoryRouter = express.Router();

//Tampilin semua inventory
inventoryRouter.get('/inventories/:user_id', getAllInventory); //ini user harus kirim data berupa json
//pake put untuk update bahan :)
inventoryRouter.put('/update-inventory/:id', updateManual);
//Cari inventory berdasarkan nama bahan
inventoryRouter.get('/search-inventory',searchInventoryByIngredient);
// Route untuk mengambil inventory berdasarkan ID
inventoryRouter.get('/inventory/:id', getInventoryById); 
//Route untuk hapus >> klo mau hapus panggil .deleteaja (buat methodnya)
inventoryRouter.delete('/delete-inventory/:id', deleteInventory);
module.exports=inventoryRouter;