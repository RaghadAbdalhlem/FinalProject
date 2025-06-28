const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      type: String, // URL or file path
      required: false,
    },
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      }
    ],
    instructions: {
      type: String, // Storing as a single text instead of array
      required: true,
    },
    nutritionalInfo: {
      calories: { type: Number, required: true },
      carbs: { type: Number, required: true },
      protein: { type: Number, required: true },
      fats: { type: Number, required: true },
    },
    dietType: {
      type: String,
      enum: ["keto", "vegan", "vegetarian", "paleo", "gluten-free", "low-carb", "high-protein", "pescatarian"],
      required: true,
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
      ref: 'User',
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
