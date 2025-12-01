import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  ratingProduct,
} from "../controller/product.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

//CREATE PRODUCT ROUTE
router.post("/", protect, createProduct);

//UPDATE PRODUCT ROUTE
router.put("/:id", protect, updateProduct);

//DELETE PRODUCT ROUTE
router.delete("/:id", protect, deleteProduct);

//GET PRODUCT BY ID ROUTE
router.get("/find/:id", protect, getProductById);

//GET ALL PRODUCTS ROUTE
router.get("/", getAllProducts);

//RATING PRODUCT ROUTE
router.put("/rating/:productId", protect, ratingProduct);

export default router;
