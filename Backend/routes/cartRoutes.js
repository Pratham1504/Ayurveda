const express = require('express');
const {isAuth} = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/add', isAuth, cartController.addItemToCart);
router.post('/remove', isAuth, cartController.removeItemFromCart);
router.post('/clear', isAuth, cartController.clearCart);

module.exports = router;