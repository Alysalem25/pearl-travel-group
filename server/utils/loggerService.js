/**
 * 📝 Logger Service
 * 
 * Centralized logging service for audit trail.
 * Handles:
 * - Safe logging (try/catch to prevent crashes)
 * - IP extraction from request
 * - Data sanitization (no passwords/tokens)
 * - Async logging without blocking main request
 * 
 * Usage:
 * const { createLog, logError } = require("../services/loggerService");
 * 
 * // In controller
 * await createLog(req.user._id, "LOGIN_SUCCESS", "User", null, "success", req);
 */

const Log = require("../models/Log");

/**
 * 🔒 SANITIZATION: Remove sensitive data from details
 */
const sanitizeDetails = (details) => {
  if (!details) return null;

  const sanitized = { ...details };

  // Remove sensitive fields
  const sensitiveFields = [
    "password",
    "token",
    "access_token",
    "refresh_token",
    "apiKey",
    "secret",
    "creditCard",
    "cvv",
    "ssn",
    "pin"
  ];

  sensitiveFields.forEach(field => {
    delete sanitized[field];
    // Also check nested objects
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
        delete sanitized[key][field];
      }
    });
  });

  return Object.keys(sanitized).length > 0 ? sanitized : null;
};

/**
 * 📍 Extract IP address from request
 * Handles X-Forwarded-For, X-Real-IP, and standard connection IP
 */
const getIPAddress = (req) => {
  if (!req) return null;

  // Check X-Forwarded-For header (for proxies, load balancers)
  const forwardedIps = req.headers["x-forwarded-for"];
  if (forwardedIps) {
    // X-Forwarded-For can be multiple IPs; take the first one
    return forwardedIps.split(",")[0].trim();
  }

  // Check X-Real-IP header
  if (req.headers["x-real-ip"]) {
    return req.headers["x-real-ip"];
  }

  // Fall back to connection remote address
  return req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip || "unknown";
};

/**
 * 🌍 Get user agent string
 */
const getUserAgent = (req) => {
  if (!req) return null;
  return req.headers["user-agent"] || null;
};

/**
 * ✅ Main logging function - CREATE LOG
 * 
 * @param {ObjectId|string} userId - User ID (optional for guest actions)
 * @param {string} action - Action name (e.g., LOGIN_SUCCESS)
 * @param {string} entity - Entity type (e.g., User, Program)
 * @param {ObjectId|string} entityId - Entity ID (optional)
 * @param {string} status - "success" or "failed"
 * @param {Object} req - Express request object (for IP, user-agent)
 * @param {number} statusCode - HTTP status code
 * @param {string} errorMessage - Error message (if failed)
 * @param {Object} details - Additional metadata (sanitized automatically)
 * @param {number} duration - Duration in milliseconds
 * 
 * @returns {Promise<Log|null>} - Created log document, or null if logging fails
 */
const createLog = async ({
  userId = null,
  action = "SYSTEM_ERROR",
  entity = "System",
  entityId = null,
  status = "success",
  req = null,
  statusCode = null,
  errorMessage = null,
  details = null,
  duration = null
} = {}) => {
  try {
    // Validate required fields
    if (!action || !entity) {
      console.warn("Logger: action and entity are required");
      return null;
    }

    // Extract request info
    const ip = getIPAddress(req);
    const userAgent = getUserAgent(req);
    const method = req?.method || null;
    const path = req?.path || null;

    // Sanitize details to remove sensitive data
    const sanitizedDetails = sanitizeDetails(details);

    // Create log document
    const log = await Log.create({
      user: userId || undefined,
      action,
      entity,
      entityId: entityId || undefined,
      status,
      statusCode: statusCode || (status === "success" ? 200 : 400),
      ip,
      userAgent,
      errorMessage: status === "failed" ? errorMessage : undefined,
      details: sanitizedDetails,
      duration,
      method,
      path
    });

    return log;
  } catch (err) {
    /**
     * CRITICAL: Never crash the app due to logging failure
     * Just log the error to console and continue
     */
    console.error("❌ Logging error:", {
      message: err.message,
      action,
      entity,
      timestamp: new Date().toISOString()
    });

    return null;
  }
};

/**
 * 🔴 Quick error logging
 * 
 * Usage:
 * logError(req.user?._id, "CREATE_USER", "User", req, { errorDetail: "..." });
 */
const logError = async (
  userId,
  action,
  entity,
  req,
  errorMessage,
  details = null
) => {
  return createLog({
    userId,
    action,
    entity,
    status: "failed",
    req,
    errorMessage: errorMessage || "An error occurred",
    details,
    statusCode: 400
  });
};

/**
 * ✅ Quick success logging
 */
const logSuccess = async (
  userId,
  action,
  entity,
  entityId,
  req,
  details = null
) => {
  return createLog({
    userId,
    action,
    entity,
    entityId,
    status: "success",
    req,
    details,
    statusCode: 200
  });
};

/**
 * 🛡️ Log permission denied
 */
const logPermissionDenied = async (userId, action, entity, req) => {
  return createLog({
    userId,
    action: "PERMISSION_DENIED",
    entity,
    status: "failed",
    req,
    statusCode: 403,
    errorMessage: "Insufficient permissions",
    details: { requestedAction: action }
  });
};

/**
 * 📊 Get recent logs (admin utility)
 */
const getRecentLogs = async (limit = 50) => {
  try {
    return await Log.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (err) {
    console.error("Error fetching recent logs:", err);
    return [];
  }
};

/**
 * 🔍 Get logs for a specific user
 */
const getUserLogs = async (userId, limit = 100) => {
  try {
    return await Log.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (err) {
    console.error("Error fetching user logs:", err);
    return [];
  }
};

/**
 * 📈 Get action statistics
 */
const getActionStats = async (days = 7) => {
  try {
    return await Log.getStats({ days });
  } catch (err) {
    console.error("Error getting stats:", err);
    return [];
  }
};

/**
 * 🔒 Check for suspicious activity (failed login attempts)
 * 
 * Usage: Check for brute force attempts
 */
const checkSuspiciousActivity = async (ip, action, limit = 5, withinMinutes = 15) => {
  try {
    const since = new Date(Date.now() - withinMinutes * 60 * 1000);

    const failedAttempts = await Log.countDocuments({
      ip,
      action,
      status: "failed",
      createdAt: { $gte: since }
    });

    return {
      isSuspicious: failedAttempts >= limit,
      failedAttempts,
      limit,
      withinMinutes
    };
  } catch (err) {
    console.error("Error checking suspicious activity:", err);
    return { isSuspicious: false, failedAttempts: 0 };
  }
};

module.exports = {
  createLog,
  logError,
  logSuccess,
  logPermissionDenied,
  getRecentLogs,
  getUserLogs,
  getActionStats,
  checkSuspiciousActivity,
  sanitizeDetails,
  getIPAddress,
  getUserAgent
};
