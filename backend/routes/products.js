const Product = require('../models/Product');
const express = require('express');
const multer = require("multer");
const authMiddleware = require('../middleware/authMiddleware');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// Set up multer for image/video uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/products/"),
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

// Create a Product
router.post("/create", authMiddleware(['admin', 'content-manager']), upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, usageInstructions, price, benefits } = req.body;
    const createdBy = req.user._id;
    let image = null;

    if (req.file) {
      image = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, '/').replace('public/', '')}`;
    }

    const newProduct = new Product({
      title,
      category,
      description,
      usageInstructions,
      benefits,
      price,
      createdBy,
      image,
    });

    await newProduct.save();
    return res.status(201).send({ status: "success", message: "Product added successfully", product: newProduct });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

// Get All Products
router.get("/", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const { searchQuery, category } = req.query;
    const searchFilter = searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {};
    const categoryFilter = category ? { category } : {};
    const roleFilter = req.user.role !== "content-manager" ? {} : { createdBy: new mongoose.Types.ObjectId(req.user._id) }

    const filterParams = {
      $and: [
        searchFilter,
        categoryFilter,
        roleFilter
      ],
    };
    const products = await Product.find(filterParams).populate({
      path: 'createdBy',
      select: {
        _id: 1, fullName: 1, email: 1, role: 1,
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get Single Product by ID
router.get("/getOne/:id", authMiddleware(['admin', 'content-manager', 'user']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update a Product
router.put("/update/:id", authMiddleware(['admin', 'content-manager']), upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, usageInstructions, price, benefits } = req.body;
    const { id } = req.params;

    const updatedData = {};
    if (title) updatedData.title = title;
    if (category) updatedData.category = category;
    if (description) updatedData.description = description;
    if (usageInstructions) updatedData.usageInstructions = usageInstructions;
    if (price) updatedData.price = price;
    if (benefits) updatedData.benefits = benefits;

    if (req.file) {
      updatedData.image = `${process.env.SERVER_URL}/${req.file.path.replace(/\\/g, '/').replace('public/', '')}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({ status: "error", message: "Product not found" });
    }

    return res.status(200).send({ status: "success", message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Delete a Product
router.delete("/delete/:id", authMiddleware(['admin', 'content-manager']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
