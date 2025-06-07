const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  amountPaid: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: [
      'Order Placed',
      'Order Confirmed',
      'In Transit',
      'Delivered',
      'Cancelled',
      'Refund Issued',
      'Refunded'
    ],
    default: 'Order Placed'
  },
  modeOfPayment: {
    type: String,
    enum: ['COD', 'UPI'],
    required: true
  },
  paymentScreenshot: {
    type: String // URL for payment screenshot (optional)
  },
  transactionId: {
    type: String // Transaction ID (optional)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;