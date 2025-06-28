const Recipe = require('../models/Recipe');
const express = require('express');
const multer = require("multer");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Set up multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/recipes/"),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueSuffix);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"));
    }
  },
});

// Create a Recipe
router.post("/create", authMiddleware(['admin', 'content-manager']), upload.single('media'), async (req, res) => {
  try {
    const { title, ingredients, instructions, nutritionalInfo, dietType } = req.body;
    const createdBy = req.user._id;
    const cingredients = JSON.parse(ingredients);
    const cnutritionalInfo = JSON.parse(nutritionalInfo);

    let media = null;
    if (req.file) {
      media = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, '/').replace('public/', '')}`;
    }

    const newRecipe = new Recipe({
      title,
      ingredients: cingredients,
      instructions,
      nutritionalInfo: cnutritionalInfo,
      createdBy,
      media,
      dietType,
    });

    await newRecipe.save();
    return res.status(201).send({ status: "success", message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});


// Get All Recipes
router.get("/", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const { searchQuery, dietType, page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Search by title if searchQuery exists
    const searchFilter = searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {};

    // Filter by dietType if provided
    const dietTypeFilter = dietType ? { dietType } : {};

    // Combine filters
    const filterParams = {
      $and: [
        searchFilter,
        dietTypeFilter
      ],
    };

    // Get total count for pagination
    const totalRecipes = await Recipe.countDocuments(filterParams);

    // Fetch paginated recipes
    const recipes = await Recipe.find(filterParams)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      recipes,
      totalPages: Math.ceil(totalRecipes / limitNumber),
      currentPage: pageNumber,
      totalRecipes
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Get Single Recipe by ID
router.get("/getOne/:id", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update a Recipe
router.put("/update/:id", authMiddleware(['admin', 'content-manager']), upload.single('media'), async (req, res) => {
  try {
    const { title, ingredients, instructions, nutritionalInfo, dietType } = req.body;
    const createdBy = req.user._id;
    const { id } = req.params;
    const cingredients = JSON.parse(ingredients);
    const cnutritionalInfo = JSON.parse(nutritionalInfo);

    const updatedData = {};
    if (title) updatedData.title = title;
    if (ingredients) updatedData.ingredients = cingredients;
    if (instructions) updatedData.instructions = instructions;
    if (nutritionalInfo) updatedData.nutritionalInfo = cnutritionalInfo;
    if (dietType) updatedData.dietType = dietType;

    if (req.file) {
      updatedData.media = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).send({ status: "error", message: "Recipe not found" });
    }

    return res.status(200).send({ status: "success", message: "Recipe updated successfully", item: updatedRecipe });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Delete a Recipe
router.delete("/delete/:id", authMiddleware(['admin', 'content-manager']), async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
