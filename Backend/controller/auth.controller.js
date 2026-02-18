import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

//Register User
//ROUTE POST /api/V1/auth/register
//PUBLIC
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//LOGIN USER
//ROUTE POST /api/V1/auth/login
//@access PUBLIC

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//LOGOUT USER
//ROUTE POST /api/V1/auth/logout
//@access public

export const logOut = asyncHandler(async (req, res) => {
  const isProd =
    String(process.env.NODE_ENV || "").toLowerCase() === "production";
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// GET CURRENT USER (ME)
// ROUTE GET /api/V1/auth/me
// PRIVATE
export const getMe = asyncHandler(async (req, res) => {
  // `protect` middleware attaches the user to req.user
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    role: req.user.role,
    status: req.user.status,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
});
