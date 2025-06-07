const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, getUserOrdersById } = require('../controllers/orderController');
const { isAuth, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

// Place an order
router.post('/place', isAuth, upload.single('image'), placeOrder);

// Get orders for the logged-in user
router.get('/my-orders', isAuth, getUserOrders);

router.get('/my-orders/:id', isAuth, getUserOrdersById);

// Get all orders (Admin only)
router.get('/all', isAuth, isAdmin, getAllOrders);

// Update order status (Admin only)
router.patch('/update-status', isAuth, isAdmin, updateOrderStatus);

module.exports = router;