import express from "express";
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controller/review.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new review
router.post("/", protect, createReview);

// Get reviews for a specific product
router.get("/product/:productId", getProductReviews);

// Get reviews by a specific user
router.get("/user/:userId", getUserReviews);

// Update a review
router.put("/:id", protect, updateReview);

// Delete a review
router.delete("/:id", protect, deleteReview);

export default router;
