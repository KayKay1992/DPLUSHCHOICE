import Review from "../models/review.model.js";
import asyncHandler from "express-async-handler";

// Create a new review
export const createReview = asyncHandler(async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;
  const userId = req.user.id; // From auth middleware
  const userName = req.user.name || req.user.username;

  // Check if user has already reviewed this product in this order
  const existingReview = await Review.findOne({ userId, productId, orderId });
  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this product in this order");
  }

  const review = new Review({
    userId,
    productId,
    orderId,
    rating,
    comment,
    userName,
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

// Get reviews for a specific product
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId }).sort({
    createdAt: -1,
  });

  res.status(200).json(reviews);
});

// Get reviews by a specific user
export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });

  res.status(200).json(reviews);
});

// Update a review (if needed)
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if the review belongs to the user
  if (review.userId !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this review");
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedReview);
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if the review belongs to the user
  if (review.userId !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Review deleted successfully" });
});
