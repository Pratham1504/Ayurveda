require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const axios = require('axios'); // Import axios for B2 authorization
const { isAuth, isAdmin } = require('../middleware/authMiddleware');
// Route to create a new ebook
router.post('/',isAuth, isAdmin, ebookController.createEbook); //admin// Ensure that the field name matches

// Route to get all eBooks
router.get('/', ebookController.getAllEbooks);

// Route to delete an eBook by ID
router.delete('/:id',isAuth, isAdmin, ebookController.deleteEbook);//admin

module.exports = router;
