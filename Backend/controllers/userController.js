const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail, sendForgotMail } = require("../middleware/sendMail");

// Register Controller
exports.signup = async (req, res) => {
  try {
    const { email, password, fullName, mobileNo, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = {
      email,
      password: hashedPassword,
      fullName,
      mobileNo,
      address, // embedded address array
    };

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "5m",
      }
    );

    const data = {
      fullName,
      otp,
    };

    await sendMail(email, "Ayurveda Clinic", data);

    res.status(200).json({
      message: "Otp send to your mail",
      activationToken,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong during registration." });
  }
};

exports.verifyotp = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;

    const verify = jwt.verify(activationToken, process.env.Activation_Secret);

    if (!verify)
      return res.status(400).json({
        message: "Otp Expired",
      });

    if (verify.otp !== otp)
      return res.status(400).json({
        message: "Wrong Otp",
      });
      // TODO: FIX the Address working part : Address ka data idhar sahi se nhi aa rha
    await User.create({
      email: verify.user.email,
      password: verify.user.password,
      fullName: verify.user.fullName,
      mobileNo: verify.user.mobileNo,
      //address: verify.user.address,
    });

    res.status(201).json({
      message: "User Registered",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while verfying OTP." });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
// TODO: Save the token in Cookies-> add cookie parser and all
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNo: user.mobileNo,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findbyId(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User fetched ", user });
  } catch (error) {
    console.error("error");
    return res.status(500).json({ message: "Error in fetching profile" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "No User with this email",
      });

    const token = jwt.sign({ email }, process.env.Forgot_Secret);

    const data = { email, token };

    await sendForgotMail("Ayurveda Clinic", data);

    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    res.json({
      message: "Reset Password Link is send to you mail",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error in forgot password" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

    const user = await User.findOne({ email: decodedData.email });

    if (!user)
      return res.status(404).json({
        message: "No user with this email",
      });

    if (user.resetPasswordExpire === null)
      return res.status(400).json({
        message: "Token Expired",
      });

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        message: "Token Expired",
      });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    user.password = password;

    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password Reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error in forgot password" });
  }
};
