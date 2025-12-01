import express from 'express';
import {
  createOrder,
  updateOrder,
  deleteOrder,  getUserOrders,
  getAllOrders
} from '../controller/order.controller.js';
const router = express.Router();

//CREATE ORDER ROUTE
router.post("/", createOrder);

//UPDATE ORDER ROUTE
router.put("/:id", updateOrder);

//DELETE ORDER ROUTE
router.delete("/:id", deleteOrder);

//GET USER ORDERS ROUTE
router.get("/find/:userId", getUserOrders);

//GET ALL ORDERS ROUTE
router.get("/", getAllOrders);

export default router;