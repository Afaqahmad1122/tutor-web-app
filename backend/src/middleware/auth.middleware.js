import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header or cookies
 */
export async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header or cookie
    let token =
      req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
}

/**
 * Middleware to check user role
 * @param {...string} allowedRoles - Allowed roles
 * @returns {Function} Middleware function
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
    }

    next();
  };
}
