const mongoose = require('mongoose');

// Define rating schema
const ratingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  MRP: {
    type: Number,  // MRP added alongside price
    required: true
  },
  company: {
    type: String,  // Company instead of category
    required: true
  },
  size: {
    type: String,  // Size of the product (e.g., "200ml", "500g")
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  usage: {
    type: String,
    required: true
  },
  image: {
    type: String, // Assuming it's a single image URL for simplicity
    required: true
  },
  ratings: [ratingSchema], // Include array of ratings
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
