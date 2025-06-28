const express = require('express');
const Recipe = require('../models/recipes'); // הייבוא של המודל שלך
const router = express.Router();

// Route לשליפת כל המתכונים
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find(); // שליפת כל המתכונים
    res.json(recipes); // מחזיר את הנתונים בדמות JSON
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
