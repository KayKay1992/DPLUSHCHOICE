// initialise application
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import stripeRoutes from "./routes/stripe.js";
import reviewRoutes from "./routes/review.route.js";

const app = express();

/**
 * 🔥 STRIPE WEBHOOK MUST COME FIRST (RAW BODY)
 */
app.use("/api/V1/stripe/webhook", express.raw({ type: "application/json" }));

/**
 * CORS
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

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
app.use("/api/V1/auth", authRoutes);
app.use("/api/V1/products", productRoutes);
app.use("/api/V1/banners", bannerRoutes);
app.use("/api/V1/users", userRoutes);
app.use("/api/V1/orders", orderRoutes);
app.use("/api/V1/reviews", reviewRoutes);
app.use("/api/V1/ai", aiRoutes);
app.use("/api/V1/stripe", stripeRoutes);

/**
 * ERRORS
 */
app.use(notFound);
app.use(errorHandler);

export default app;
