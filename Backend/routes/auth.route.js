import express from "express";
import {
  registerUser,
  loginUser,
  logOut,
  getMe,
} from "../controller/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

//REGISTER USER ROUTE
router.post("/register", registerUser);

//LOGIN USER ROUTE
router.post("/login", loginUser);

//LOGOUT USER ROUTE
router.get("/logout", protect, logOut);

//GET CURRENT USER
router.get("/me", protect, getMe);

export default router;
