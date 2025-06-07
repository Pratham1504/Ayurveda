const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add item to cart
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid product or user ID' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Recalculate totals
    let totalMRP = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      totalMRP += prod.MRP * item.quantity;
      totalPrice += prod.price * item.quantity;
    }

    cart.totalBill = totalMRP;
    cart.amountToPay = totalPrice;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid product or user ID' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    if (cart.items[itemIndex].quantity > quantity) {
      cart.items[itemIndex].quantity -= quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    // Recalculate totals
    let totalMRP = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      totalMRP += prod.MRP * item.quantity;
      totalPrice += prod.price * item.quantity;
    }

    cart.totalBill = totalMRP;
    cart.amountToPay = totalPrice;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.totalBill = 0;
    cart.amountToPay = 0;

    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
module.exports = { addItemToCart, removeItemFromCart, clearCart };