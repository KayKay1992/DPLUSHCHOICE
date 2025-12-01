import express from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
} from "../controller/order.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

//CREATE ORDER ROUTE
router.post("/", protect, createOrder);

//UPDATE ORDER ROUTE
router.put("/:id", protect, updateOrder);

//DELETE ORDER ROUTE
router.delete("/:id", protect, deleteOrder);

//GET USER ORDERS ROUTE
router.get("/find/:userId", protect, getUserOrders);

//GET ALL ORDERS ROUTE
router.get("/", protect, getAllOrders);

export default router;
