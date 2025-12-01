//initialise application
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

const app = express();

//cors
app.use(cors());

//json body
app.use(express.json());

//cookie parser
app.use(cookieParser());

//routes
app.use("/api/V1/auth", authRoutes);
app.use("/api/V1/products", productRoutes);
app.use("/api/V1/banners", bannerRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/ai", aiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
