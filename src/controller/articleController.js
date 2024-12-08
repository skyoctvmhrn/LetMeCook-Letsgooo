"use strict";
const Article = require("../models/article.js"); //panggil modelnya (class >> isi properties)
exports.getArticles = async (req, res) => {
  try {
    //baca semua data artikel
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data artikel' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id; // Ambil ID artikel dari parameter URL

    const article = await Article.findByPk(articleId); // Cari artikel berdasarkan ID

    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' }); // Jika artikel tidak ditemukan, kirim respons 404
    }

    res.json(article); // Kirim data artikel jika ditemukan
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data artikel' });
  }
};
