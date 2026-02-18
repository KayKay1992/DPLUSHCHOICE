import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  initializePaystack,
  paystackWebhook,
  verifyPaystack,
} from "../controller/paystack.controller.js";

const router = express.Router();

// Create Paystack transaction and get authorization URL
router.post("/initialize", protect, initializePaystack);

// Verify a transaction after redirect (creates order if payment is successful)
router.get("/verify/:reference", protect, verifyPaystack);

// Webhook (do NOT protect; verified by signature)
router.post("/webhook", paystackWebhook);

export default router;
