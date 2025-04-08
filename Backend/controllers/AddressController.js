const Address = require("../models/addressModel");
const User = require("../models/userModel");

// ! Address routes are added in user routes

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "NO USER FOUND" });
    }

    const {
      phone,
      houseNo,
      street,
      landmark,
      city,
      state,
      pincode,
      addressType,
    } = req.body;

    if (
      !phone ||
      !houseNo ||
      !street ||
      !landmark ||
      !city ||
      !state ||
      !pincode ||
      !addressType
    ) {
      return res.status(400).json({ message: "All fields are necessary" });
    }

    const address = await Address.create({
      phone,
      houseNo,
      street,
      landmark,
      city,
      state,
      pincode,
      addressType,
    });

    user.address.push(address._id);
    await user.save();

    return res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while adding the address" });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "NO USER FOUND" });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ message: "ADDRESS NOT FOUND" });
    }

    // Remove address from the user's address array
    user.address = user.address.filter(id => id.toString() !== addressId);
    await user.save();

    // Delete address from Address collection
    await Address.findByIdAndDelete(addressId);

    return res.status(200).json({ message: "Address removed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while deleting the address" });
  }
};
