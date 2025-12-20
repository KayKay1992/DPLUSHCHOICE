import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

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
