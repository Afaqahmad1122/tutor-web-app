import express from "express";
import {
  register,
  login,
  logout,
  verifyOTP,
  resendOTPHandler,
  getMe,
  testEmail,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTPHandler);
router.post("/login", login);
router.post("/test-email", testEmail); // Test email endpoint

// Protected routes (require authentication)
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
