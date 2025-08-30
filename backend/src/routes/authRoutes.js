import express from "express"
const router = express.Router();
import {login, sendOTP, signUp, getUserDetails} from '../controllers/authController.js';
import { protect } from "../middleware/auth.js";

// Register route
router.post('/register', signUp);

// Verify OTP route
router.post('/sendOTP', sendOTP);

// Login route
router.post('/login', login);

router.get('/getUserDetails', protect, getUserDetails);

export default router;