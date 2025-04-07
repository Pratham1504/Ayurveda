const mongoose = require("mongoose");
const addressSchema = require('./addressModel');

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index : true,
  },
  password :{
    type : String,
    required : [true,"Password is required"],
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default : "user",
    required: false,
  },
  mobileNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ 
  },
  orderHistory : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Orders"
    }
  ],
  address: [addressSchema] 
});

const User = mongoose.model("User", userSchema);

module.exports = User;




