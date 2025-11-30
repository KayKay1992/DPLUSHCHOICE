//initialise application
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorHandler.middleware.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import bannerRoutes from './routes/banner.route.js';

const app = express();

//cors
app.use(cors());

//json body
app.use(express.json());

//cookie parser
app.use(cookieParser());

//routes
app.use('/api/V1/auth', authRoutes);
app.use('/api/V1/products', productRoutes);
app.use('/api/V1/banners', bannerRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


export default app;