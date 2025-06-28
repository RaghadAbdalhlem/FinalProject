const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

// Get Favorite Recipes for the Logged-in User
router.get('/', authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalRecipes = await Recipe.countDocuments({ favorites: userId });
    const recipes = await Recipe.find({ favorites: userId }).populate('createdBy', 'fullName email')
      .skip(skip)
      .limit(limitNumber);

    if (!recipes) {
      return res.status(404).json({ message: 'No favorite recipes found' });
    }

    return res.status(200).json({
      recipes,
      totalPages: Math.ceil(totalRecipes / limitNumber),
      currentPage: pageNumber,
      totalRecipes
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

// Add Recipe to Favorites
router.post('/add/:recipeId', authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;
    console.log(recipeId)

    // Find the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Add user to recipe favorites if not already added
    if (!recipe.favorites.includes(userId)) {
      recipe.favorites.push(userId);
      await recipe.save();
      return res.status(200).json({ message: 'Recipe added to favorites' });
    } else {
      return res.status(400).json({ message: 'Recipe is already in favorites' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Remove Recipe from Favorites
router.delete('/delete/:recipeId', authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;

    // Find the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Remove user from recipe favorites
    const index = recipe.favorites.indexOf(userId);
    if (index > -1) {
      recipe.favorites.splice(index, 1);
      await recipe.save();
      return res.status(200).json({ message: 'Recipe removed from favorites' });
    } else {
      return res.status(400).json({ message: 'Recipe is not in favorites' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

