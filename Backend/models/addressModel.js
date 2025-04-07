const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // Indian mobile number validation
  },
  houseNo: {
    type: String,
    required: true, 
    trim: true
  },
  street: {
    type: String,
    required: true, // Street name / Area
    trim: true
  },
  landmark: {
    type: String,
    default: '', // optional
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/ // Valid 6-digit PIN
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = addressSchema;
