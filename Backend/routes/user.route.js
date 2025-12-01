import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";
const router = express.Router();

//GET ALL USERS ROUTE
router.get("/", getAllUsers);

//GET USER BY ID ROUTE
router.get("/find/:userId", getUserById);

//UPDATE USER ROUTE
router.put("/:userId", updateUser);

//DELETE USER ROUTE
router.delete("/:id", deleteUser);

export default router;

