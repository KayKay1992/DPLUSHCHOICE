import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  ratingProduct,
} from "../controller/product.controller.js";
import multer from "multer";
// import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//CREATE PRODUCT ROUTE
router.post("/", upload.single("img"), createProduct);

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
