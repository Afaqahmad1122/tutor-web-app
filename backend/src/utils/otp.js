import crypto from "crypto";
import bcrypt from "bcrypt";

// Configuration constants
const OTP_LENGTH = 6;
const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_VERIFICATION_ATTEMPTS = 5;
const CLEANUP_INTERVAL_MS = 60 * 1000; // Cleanup expired entries every minute

/**
 * Store structure:
 * {
 *   otpHash: string (hashed OTP),
 *   expiresAt: number,
 *   attempts: number,
 *   createdAt: number,
 *   lastAttemptAt: number
 * }
 */
const otpStore = new Map();

/**
 * Initialize automatic cleanup of expired OTPs
 */
let cleanupInterval = null;

function startCleanupTimer() {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const keysToDelete = [];

    for (const [email, data] of otpStore.entries()) {
      if (now > data.expiresAt) {
        keysToDelete.push(email);
      }
    }

    keysToDelete.forEach((email) => otpStore.delete(email));

    if (keysToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${keysToDelete.length} expired OTP(s)`);
    }
  }, CLEANUP_INTERVAL_MS);
}

// Start cleanup timer on module load
startCleanupTimer();

/**
 * Generate cryptographically secure 6-digit OTP
 * Uses crypto.randomInt for better security than Math.random()
 * @returns {string} 6-digit OTP code
 */
export function generateOTP() {
  // Generate secure random number between 100000 and 999999
  const min = 100000;
  const max = 999999;
  return crypto
    .randomInt(min, max + 1)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate OTP format (6 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid OTP format
 */
function isValidOTPFormat(otp) {
  if (!otp || typeof otp !== "string") return false;
  return /^\d{6}$/.test(otp);
}

/**
 * Store OTP with expiration and security features
 * - Hashes OTP before storing (like passwords)
 * - Tracks verification attempts
 * - Sets expiration time
 * @param {string} email - User email (normalized to lowercase)
 * @param {string} otp - Plain OTP code
 * @returns {Promise<void>}
 * @throws {Error} If email or OTP is invalid
 */
export async function storeOTP(email, otp) {
  // Input validation
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!isValidOTPFormat(otp)) {
    throw new Error("Invalid OTP format");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + OTP_EXPIRATION_MS;
  const createdAt = Date.now();

  // Hash OTP using bcrypt (salt rounds: 10)
  const otpHash = await bcrypt.hash(otp, 10);

  // Store hashed OTP with metadata
  otpStore.set(normalizedEmail, {
    otpHash,
    expiresAt,
    attempts: 0,
    createdAt,
    lastAttemptAt: null,
  });

  // Cleanup any existing expired entry for this email
  const existing = otpStore.get(normalizedEmail);
  if (existing && Date.now() > existing.expiresAt) {
    otpStore.delete(normalizedEmail);
  }
}

/**
 * Verify OTP with security features
 * - Rate limiting (max attempts)
 * - Hashed comparison (prevents timing attacks)
 * - Automatic expiration check
 * @param {string} email - User email
 * @param {string} otp - OTP code to verify
 * @returns {Promise<{valid: boolean, reason?: string}>} Verification result
 */
export async function verifyOTP(email, otp) {
  // Input validation
  if (!isValidEmail(email)) {
    return { valid: false, reason: "Invalid email format" };
  }

  if (!isValidOTPFormat(otp)) {
    return { valid: false, reason: "Invalid OTP format" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  // Always perform timing-safe comparison (prevent timing attacks)
  // Use bcrypt.compare even if no OTP exists (constant-time operation)
  if (!stored) {
    // Perform dummy hash comparison to prevent timing attacks
    await bcrypt.compare(otp, "$2b$10$dummyhashforsecuritypurposes");
    return { valid: false, reason: "OTP not found or expired" };
  }

  // Check if expired
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    // Perform dummy comparison for timing safety
    await bcrypt.compare(otp, "$2b$10$dummyhashforsecuritypurposes");
    return { valid: false, reason: "OTP expired" };
  }

  // Check rate limiting
  if (stored.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return { valid: false, reason: "Maximum verification attempts exceeded" };
  }

  // Increment attempt counter
  stored.attempts += 1;
  stored.lastAttemptAt = Date.now();

  // Verify OTP using bcrypt (constant-time comparison)
  const isValid = await bcrypt.compare(otp, stored.otpHash);

  if (isValid) {
    // Delete OTP after successful verification (single-use)
    otpStore.delete(normalizedEmail);
    return { valid: true };
  }

  // Store updated attempts
  otpStore.set(normalizedEmail, stored);

  return { valid: false, reason: "Invalid OTP" };
}

/**
 * Delete OTP from store (for manual cleanup or resend scenarios)
 * @param {string} email - User email
 * @returns {boolean} True if OTP was deleted, false if not found
 */
export function deleteOTP(email) {
  if (!isValidEmail(email)) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return otpStore.delete(normalizedEmail);
}

/**
 * Get OTP metadata (for debugging/monitoring - production use Redis)
 * @param {string} email - User email
 * @returns {object|null} OTP metadata or null if not found
 */
export function getOTPInfo(email) {
  if (!isValidEmail(email)) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  if (!stored) {
    return null;
  }

  // Return metadata without exposing the hash
  return {
    email: normalizedEmail,
    expiresAt: stored.expiresAt,
    attempts: stored.attempts,
    remainingAttempts: MAX_VERIFICATION_ATTEMPTS - stored.attempts,
    isExpired: Date.now() > stored.expiresAt,
    createdAt: stored.createdAt,
    lastAttemptAt: stored.lastAttemptAt,
  };
}

/**
 * Clear all OTPs (for testing/emergency cleanup)
 * In production, prefer using Redis with TTL
 */
export function clearAllOTPs() {
  const count = otpStore.size;
  otpStore.clear();
  return count;
}

/**
 * Stop cleanup timer (for testing)
 */
export function stopCleanupTimer() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
