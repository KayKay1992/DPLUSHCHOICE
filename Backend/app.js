//initialise application
import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorHandler.middleware.js';
import cookieParser from 'cookie-parser';
const app = express();


//json body
app.use(express.json());

//cookie parser
app.use(cookieParser());

//cors
app.use(cors());

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


export default app;