import express from "express";
import {
  register,
  login,
  logout,
  verifyOTP,
  resendOTPHandler,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTPHandler);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
