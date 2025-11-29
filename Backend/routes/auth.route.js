import express from 'express';
import { registerUser, loginUser, logOut } from '../controller/auth.controller.js';


const router = express.Router();


//REGISTER USER ROUTE
router.post('/register', registerUser);


//LOGIN USER ROUTE
router.post('/login', loginUser);


//LOGOUT USER ROUTE
router.post('/logout',  logOut);

export default router;