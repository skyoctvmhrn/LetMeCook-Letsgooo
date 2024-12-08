"use strict";  //biar lebih aman
const express = require('express');
const {getArticles}=require('../controller/articleController.js');
const {getArticleById}=require('../controller/articleController.js')


const articleRouter = express.Router();

//Routenya jadi /api/articles
articleRouter.get('/articles', getArticles);
// Route untuk mengambil artikel berdasarkan ID
articleRouter.get('/articles/:id', getArticleById);

module.exports=articleRouter;