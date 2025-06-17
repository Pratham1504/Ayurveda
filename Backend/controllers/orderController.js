const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { uploadFile } = require("../middleware/cloudinary");
const sendTelegramAlert = require("./sendMessageAlert");

const generateOrderTelegramMessage = (user, order) => {
  return `
🛒 *New Order Placed!*

👤 *User:* ${user.name} (${user.email})
🆔 *User ID:* ${user._id}

💰 *Amount Paid:* ₹${order.amountPaid}
💳 *Payment Mode:* ${order.modeOfPayment}
🧾 *Transaction ID:* ${order.transactionId || "N/A"}

📦 *Items:*
${order.items.map(
  (item, i) => `  ${i + 1}. ${item.product.name} x${item.quantity}`
).join("\n")}

🕐 *Order Time:* ${new Date(order.createdAt).toLocaleString('en-IN')}
🔗 link: ${process.env.CORS_ORIGIN}admin/orders
`;
};

// Place an order
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { modeOfPayment, transactionId, items } = req.body;

  if (
    modeOfPayment === "UPI" &&
    (!req.file ||
      !transactionId ||
      transactionId.trim() === "")
  ) {
    return res.status(400).json({
      message: "Payment screenshot and Transaction ID are required for UPI payments",
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order items are required",
    });
  }

  try {
    // Validate product IDs and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const { productId, quantity } of items) {
      const product = await Product.findById(productId); // assumes Product model
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }
      totalAmount += product.price * quantity;
      orderItems.push({
        product: product._id,
        quantity,
      });
    }

    let fileRes = null;
    if (modeOfPayment === "UPI") {
      fileRes = await uploadFile(req.file.path);
      if (!fileRes || !fileRes.url) {
        return res.status(500).json({ message: "Failed to upload payment screenshot" });
      }
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      amountPaid: totalAmount,
      modeOfPayment,
      paymentScreenshot: modeOfPayment === "UPI" ? fileRes.url : null,
      transactionId,
    });

    await newOrder.save();

    const user = await User.findById(userId);
    user.orderHistory.push(newOrder._id);
    await user.save();

    const message = generateOrderTelegramMessage(user, newOrder);
    sendTelegramAlert(message);

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
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
