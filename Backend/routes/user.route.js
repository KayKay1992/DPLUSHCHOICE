import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

//GET ALL USERS ROUTE
router.get("/", protect, getAllUsers);

//GET USER BY ID ROUTE
router.get("/find/:userId", protect, getUserById);

//UPDATE USER ROUTE
router.put("/:userId", protect, updateUser);

//DELETE USER ROUTE
router.delete("/:id", protect, deleteUser);

export default router;
