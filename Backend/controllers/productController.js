const Product = require('../models/productModel');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log(req.file.path)
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const product = new Product({
      ...req.body,
      image: result.secure_url // Store the Cloudinary URL
    });
    await product.save();
    // Cleanup: Remove the temporary file after upload
    fs.unlinkSync(req.file.path);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching product', error });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    // Check if there is a new image in the request
    if (req.file) {
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // Add the new image URL to the update data
      updatedData.image = result.secure_url;
    }

    // Find the product by ID and update it
    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};


// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
};

// Add a rating to a product
const addRating = async (req, res) => {
  try {
    const { name, email, review, rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Push new rating into the product's ratings array
    product.ratings.push({ name, email, review, rating });
    await product.save();

    res.status(200).json({ message: 'Rating added successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error adding rating', error });
  }
};

// Get all ratings for a product
const getRatings = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.ratings);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching ratings', error });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addRating,
  getRatings
};
