// initialise application
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.middleware.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import bannerRoutes from "./routes/banner.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import aiRoutes from "./routes/ai.route.js";
import reviewRoutes from "./routes/review.route.js";
import paystackRoutes from "./routes/paystack.route.js";

const app = express();

// Trust Render's proxy so secure cookies work correctly
app.set("trust proxy", 1);

/**
 * CORS – reads allowed origins from CORS_ORIGINS env var (comma-separated).
 * Falls back to localhost for local development.
 */
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

/**
 * Paystack webhook needs raw body BEFORE express.json() to validate x-paystack-signature
 */
app.use("/api/V1/paystack/webhook", express.raw({ type: "application/json" }));

/**
 * Apply CORS to all routes + handle preflight OPTIONS
 */
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/**
 * NORMAL BODY PARSER (AFTER WEBHOOK)
 */
app.use(express.json());

/**
 * STATIC FILES
 */
app.use("/uploads", express.static("uploads"));

/**
 * COOKIES
 */
app.use(cookieParser());

/**
 * ROUTES
 */
app.get("/", (req, res) => {
  res.json({ message: "D' Plush Choice API is running ✅", status: "ok" });
});
app.use("/api/V1/auth", authRoutes);
app.use("/api/V1/products", productRoutes);
app.use("/api/V1/banners", bannerRoutes);
app.use("/api/V1/users", userRoutes);
app.use("/api/V1/orders", orderRoutes);
app.use("/api/V1/reviews", reviewRoutes);
app.use("/api/V1/ai", aiRoutes);
app.use("/api/V1/paystack", paystackRoutes);

/**
 * ERRORS
 */
app.use(notFound);
app.use(errorHandler);

export default app;
