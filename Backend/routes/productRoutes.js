const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './uploads/' }); // Temporary storage
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addRating, getRatings } = require('../controllers/productController');

const router = express.Router();

// POST /products - Create a new product
router.post('/', upload.single('image'), createProduct);

// GET /products/:id - Get a single product by ID
router.get('/:id', getProduct);

// GET /products - Get all products
router.get('/', getAllProducts);

// PUT /products/:id - Update a product by ID
router.put('/:id', upload.single('image'), updateProduct);

// DELETE /products/:id - Delete a product by ID
router.delete('/:id', deleteProduct);

// POST /products/:id/rating - Add a rating to a product
router.post('/:id/rating', addRating);

// GET /products/:id/ratings - Get all ratings for a product
router.get('/:id/ratings', getRatings);

module.exports = router;
