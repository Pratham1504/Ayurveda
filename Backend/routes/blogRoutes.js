const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Define routes
router.post('/', blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);
router.patch('/:id/like', blogController.likeBlog);
router.patch('/:id/dislike', blogController.dislikeBlog);
router.post('/:id/comment', blogController.addComment); 

module.exports = router;
