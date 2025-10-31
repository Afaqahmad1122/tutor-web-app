import { prisma } from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { generateOTP, storeOTP, verifyOTP, deleteOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/email.js";
import { UserRole } from "@prisma/client";

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} phone - User phone (optional)
 * @param {string} password - User password
 * @param {string} role - User role (TUTOR or STUDENT)
 * @returns {Promise<object>} Created user (without password)
 */
export async function registerUser(email, phone, password, role) {
  // Validate role
  const validRoles = [UserRole.TUTOR, UserRole.STUDENT];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role. Must be TUTOR or STUDENT");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already registered");
    }
    if (phone && existingUser.phone === phone) {
      throw new Error("Phone number already registered");
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      phone: phone || null,
      passwordHash,
      role,
      verified: false,
      active: true,
    },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      verified: true,
      active: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Generate and send OTP for email verification
 * @param {string} email - User email
 * @returns {Promise<string>} OTP code (in development, return OTP; in production, send via email)
 */
export async function sendOTP(email) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.verified) {
    throw new Error("User already verified");
  }

  // Generate OTP
  const otp = generateOTP();
  await storeOTP(email, otp);

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
  } catch (error) {
    // If email fails, log error
    console.error(`Failed to send email to ${email}:`, error.message);
  }

  return otp;
}

/**
 * Verify OTP and mark user as verified
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise<object>} Updated user
 */
export async function verifyOTPCode(email, otp) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.verified) {
    throw new Error("User already verified");
  }

  // Verify OTP (now returns {valid, reason})
  const result = await verifyOTP(email, otp);

  if (!result.valid) {
    throw new Error(result.reason || "Invalid or expired OTP");
  }

  // Mark user as verified
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { verified: true },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      verified: true,
      active: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} User data and JWT token
 */
export async function loginUser(email, password) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.active) {
    throw new Error("Account is suspended");
  }

  // Check if user is verified
  if (!user.verified) {
    throw new Error(
      "Please verify your email before logging in. Check your email for OTP."
    );
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken(user.id, user.role);

  // Return user data (without password) and token
  const userData = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    verified: user.verified,
    active: user.active,
    createdAt: user.createdAt,
  };

  return {
    user: userData,
    token,
  };
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} User data
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      verified: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Resend OTP
 * @param {string} email - User email
 * @returns {Promise<string>} New OTP code
 */
export async function resendOTP(email) {
  return await sendOTP(email);
}
