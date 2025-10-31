import jwt from "jsonwebtoken";

/**
 * Generate JWT token for user
 * @param {string} userId - User ID
 * @param {string} role - User role (TUTOR, STUDENT, ADMIN)
 * @returns {string} JWT token
 */
export function generateToken(userId, role) {
  const payload = {
    userId,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Generate refresh token (optional, for future use)
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}
