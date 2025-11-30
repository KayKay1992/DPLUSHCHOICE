import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  ratingProduct,
} from "../controller/product.controller.js";

const router = express.Router();

//CREATE PRODUCT ROUTE
router.post("/", createProduct);

//UPDATE PRODUCT ROUTE
router.put("/:id", updateProduct);

//DELETE PRODUCT ROUTE
router.delete("/:id", deleteProduct);

//GET PRODUCT BY ID ROUTE
router.get("/find/:id", getProductById);

//GET ALL PRODUCTS ROUTE
router.get("/", getAllProducts);

//RATING PRODUCT ROUTE
router.put("/rating/:productId", ratingProduct);

export default router;
