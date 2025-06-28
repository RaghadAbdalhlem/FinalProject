const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["vitamins", "proteins", "supplements", "herbs", "minerals", "other"], 
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    usageInstructions: {
      type: String,
      required: true,
      trim: true,
    },
    benefits: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Create a Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
