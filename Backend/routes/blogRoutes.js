const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { isAdmin, isAuth } = require('../middleware/authMiddleware');

// Define routes
router.post('/',isAuth, isAdmin, blogController.createBlog); 
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id',isAuth, isAdmin, blogController.updateBlog);
router.delete('/:id',isAuth, isAdmin, blogController.deleteBlog);
router.patch('/:id/like', isAuth, blogController.likeBlog);
router.patch('/:id/dislike', isAuth, blogController.dislikeBlog);
router.post('/:id/comment', isAuth, blogController.addComment); 

module.exports = router;
