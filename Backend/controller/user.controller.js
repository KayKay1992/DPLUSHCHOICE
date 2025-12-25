import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Product from "../models/product.model.js";

//Update User
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // If updating password, verify current password
  if (req.body.password) {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if currentPassword is provided
    if (!req.body.currentPassword) {
      res.status(400);
      throw new Error("Current password is required to change password");
    }

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Remove currentPassword from req.body
    delete req.body.currentPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  ).select("-password");

  if (updatedUser) {
    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } else {
    res.status(404);
    throw new Error("Something went wrong while updating user");
  }
});

//Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (deletedUser) {
    res.status(200).json({
      message: "User deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Something went wrong while deleting user");
  }
});

//Get one User
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("Something went wrong while fetching users");
  }
});

const ensureSelf = (req, userId) => {
  if (!req.user) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    throw err;
  }
  if (String(req.user._id) !== String(userId)) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
};

// Get Wishlist (logged-in user)
// ROUTE GET /api/V1/users/:userId/wishlist
// PRIVATE (self)
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  ensureSelf(req, userId);

  const user = await User.findById(userId).select("wishlist");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const ids = Array.isArray(user.wishlist) ? user.wishlist : [];
  const products = await Product.find({ _id: { $in: ids } }).sort({
    createdAt: -1,
  });

  res.status(200).json({ wishlist: products });
});

// Add to Wishlist
// ROUTE POST /api/V1/users/:userId/wishlist/:productId
// PRIVATE (self)
export const addToWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  ensureSelf(req, userId);

  const exists = await Product.findById(productId).select("_id");
  if (!exists) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).select("wishlist");

  res
    .status(200)
    .json({ message: "Added to wishlist", wishlist: user?.wishlist || [] });
});

// Remove from Wishlist
// ROUTE DELETE /api/V1/users/:userId/wishlist/:productId
// PRIVATE (self)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  ensureSelf(req, userId);

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true }
  ).select("wishlist");

  res
    .status(200)
    .json({ message: "Removed from wishlist", wishlist: user?.wishlist || [] });
});
