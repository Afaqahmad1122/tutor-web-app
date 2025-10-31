import {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTPCode,
  getUserById,
  resendOTP,
} from "../services/auth.service.js";
import { testEmailConfig, verifyEmailConfig } from "../utils/email.js";

/**
 * Register new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { email, phone, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // Validate role
    if (!["TUTOR", "STUDENT"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be TUTOR or STUDENT",
      });
    }

    // Register user
    const user = await registerUser(email, phone, password, role);

    // Send OTP (for email verification)
    const otp = await sendOTP(email);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with OTP.",
      data: {
        user,
        // In development, return OTP for testing
        ...(process.env.NODE_ENV === "development" && { otp }),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
}

/**
 * Verify OTP and complete registration
 * POST /api/auth/verify-otp
 */
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await verifyOTPCode(email, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
}

/**
 * Resend OTP
 * POST /api/auth/resend-otp
 */
export async function resendOTPHandler(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = await resendOTP(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { data: { otp } }),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to resend OTP",
    });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { user, token } = await loginUser(email, password);

    // Set token in cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 * Requires authentication
 */
export async function getMe(req, res) {
  try {
    const userId = req.user.userId;

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "User not found",
    });
  }
}

/**
 * Test email configuration
 * POST /api/auth/test-email
 * For testing email setup only
 */
export async function testEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required for testing",
      });
    }

    // First verify email configuration
    const isVerified = await verifyEmailConfig();

    if (!isVerified) {
      return res.status(500).json({
        success: false,
        message:
          "Email configuration verification failed. Please check your .env file.",
      });
    }

    // Send test email
    const result = await testEmailConfig(email);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          messageId: result.messageId,
          sentTo: email,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to test email configuration",
    });
  }
}
