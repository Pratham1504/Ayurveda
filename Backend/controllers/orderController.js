const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const { uploadFile } = require("../middleware/cloudinary");

// Place an order
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { modeOfPayment, transactionId } = req.body;
  if (
    modeOfPayment === "UPI" &&
    (!req.file ||
      !transactionId ||
      transactionId === "" ||
      transactionId.trim("\\s+") === "")
  ) {
    return res
      .status(400)
      .json({
        message:
          "Payment screenshot and Transaction ID is required for UPI payments",
      });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let fileRes = null;
    if (modeOfPayment === "UPI") {
      fileRes = await uploadFile(req.file.path);
      if (!fileRes) {
        return fileRes
          .status(500)
          .json({ message: "Failed to upload payment screenshot" });
      }
    }

    console.log("Aaya");
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      amountPaid: cart.amountToPay,
      modeOfPayment,
      paymentScreenshot: modeOfPayment === "UPI" ? fileRes.url : null,
      transactionId,
    });

    await newOrder.save();

    // Clear the cart
    cart.items = [];
    cart.totalBill = 0;
    cart.amountToPay = 0;
    await cart.save();

    // Add order to user's order history
    const user = await User.findById(userId);
    user.orderHistory.push(newOrder._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product user");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    console.log("Updating order:", orderId, "to:", status);

    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrdersById = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "items.product"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
