//initialise application
import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorHandler.middleware.js';
const app = express();


//json body
app.use(express.json());

//cors
app.use(cors());

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


export default app;