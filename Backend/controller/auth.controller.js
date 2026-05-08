import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import sendWelcomeEmail from "../utils/sendWelcomeEmail.js";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    sendWelcomeEmail(user); // fire-and-forget, does not block the response
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

// FORGOT PASSWORD
// ROUTE POST /api/V1/auth/forgot-password
// PUBLIC
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No account found with that email");
  }

  // Generate a random token and hash it before storing
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5174";
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

  try {
    const html = await ejs.renderFile(
      path.resolve(__dirname, "../templates/resetPassword.ejs"),
      { name: user.name, resetUrl },
    );
    await sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request – D' Plush Choice",
      html,
      attachments: [
        {
          filename: "logo.jpg",
          path: path.resolve(__dirname, "../assets/logo.jpg"),
          cid: "logo",
        },
      ],
    });
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    // Roll back token if email fails
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    res.status(500);
    throw new Error("Email could not be sent. Please try again.");
  }
});

// RESET PASSWORD
// ROUTE PUT /api/V1/auth/reset-password/:token
// PUBLIC
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});
