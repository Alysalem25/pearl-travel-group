/**
 * 📋 Audit Log Model
 * 
 * Tracks all important user actions for auditing and debugging purposes.
 * Indexed for efficient querying and filtering.
 * 
 * Security:
 * - Never stores passwords, tokens, or sensitive data in details
 * - Details should only contain sanitized metadata
 * - Access restricted to admins only
 */

const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    /**
     * User who performed the action (optional - allows guest logs)
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },

    /**
     * Action performed (e.g., LOGIN_SUCCESS, CREATE_USER, DELETE_PROGRAM)
     * Should use UPPERCASE_SNAKE_CASE conventions
     */
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
      // Common actions
      enum: [
        // Auth actions
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "LOGOUT",
        "REGISTER_SUCCESS",
        "REGISTER_FAILED",
        "PASSWORD_RESET",
        "TOKEN_REFRESH",
        
        // User actions
        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "USER_ROLE_CHANGED",
        
        // Program actions
        "CREATE_PROGRAM",
        "UPDATE_PROGRAM",
        "DELETE_PROGRAM",
        
        // Booking actions
        "CREATE_BOOKING",
        "UPDATE_BOOKING",
        "CANCEL_BOOKING",
        "DELETE_BOOKING",
        
        // Admin actions
        "ADMIN_ACCESS",
        "ADMIN_EXPORT_DATA",
        "ADMIN_BULK_DELETE",
        
        // Category actions
        "CREATE_CATEGORY",
        "UPDATE_CATEGORY",
        "DELETE_CATEGORY",
        
        // Country actions
        "CREATE_COUNTRY",
        "UPDATE_COUNTRY",
        "DELETE_COUNTRY",
        
        // Cruise actions
        "CREATE_CRUISE",
        "UPDATE_CRUISE",
        "DELETE_CRUISE",
        
        // Hotel actions
        "CREATE_HOTEL",
        "UPDATE_HOTEL",
        "DELETE_HOTEL",
        
        // Other
        "PERMISSION_DENIED",
        "INVALID_REQUEST",
        "SYSTEM_ERROR"
      ]
    },

    /**
     * Type of entity affected (e.g., "User", "Program", "Booking")
     */
    entity: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: [
        "User",
        "Program",
        "Booking",
        "Category",
        "Country",
        "Cruise",
        "Hotel",
        "Flight",
        "CarTrip",
        "Visa",
        "Company",
        "Event",
        "System"
      ]
    },

    /**
     * ID of the affected entity (optional - for system events like login)
     */
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },

    /**
     * Status of the action
     */
    status: {
      type: String,
      required: true,
      enum: ["success", "failed"],
      index: true,
      default: "success"
    },

    /**
     * HTTP status code (e.g., 200, 400, 401, 403, 500)
     */
    statusCode: {
      type: Number,
      default: null
    },

    /**
     * IP address of the requester
     * Used for security monitoring and geographic analysis
     */
    ip: {
      type: String,
      default: null
    },

    /**
     * User agent string (browser/client info)
     */
    userAgent: {
      type: String,
      default: null
    },

    /**
     * Error message (if status is failed)
     * Should be sanitized - no sensitive data
     */
    errorMessage: {
      type: String,
      default: null
    },

    /**
     * Additional metadata (sanitized)
     * RULES:
     * - Never include passwords, tokens, or API keys
     * - Never include sensitive personal information
     * - Only include data relevant to the action
     * 
     * Example:
     * {
     *   "changedFields": ["name", "email"],
     *   "previousValue": "John",
     *   "newValue": "Jane",
     *   "itemsCount": 5
     * }
     */
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    /**
     * Performance metrics
     */
    duration: {
      type: Number, // milliseconds
      default: null
    },

    /**
     * Request method (GET, POST, PUT, DELETE)
     */
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      default: null
    },

    /**
     * Request path (e.g., /api/users, /api/programs/:id)
     * Should be normalized/sanitized to avoid log bloat
     */
    path: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * ⚡ INDEXES FOR EFFICIENT QUERYING
 * 
 * Compound indexes for common query patterns
 */

// Find logs by user and date (user activity history)
LogSchema.index({ user: 1, createdAt: -1 });

// Find logs by action and date (action audits)
LogSchema.index({ action: 1, createdAt: -1 });

// Find logs by status (success/failure analysis)
LogSchema.index({ status: 1, createdAt: -1 });

// Find logs by entity (entity-specific history)
LogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

// Find failed attempts (security monitoring)
LogSchema.index({ status: 1, ip: 1, createdAt: -1 });

// TTL Index: Auto-delete logs older than 90 days (optional)
// Uncomment to enable automatic cleanup
// LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

/**
 * 🔍 Static method to search logs with filters
 */
LogSchema.statics.searchLogs = async function ({
  userId,
  action,
  entity,
  status,
  startDate,
  endDate,
  ip,
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = -1
} = {}) {
  try {
    // Build filter object
    const filter = {};

    if (userId) filter.user = userId;
    if (action) filter.action = action;
    if (entity) filter.entity = entity;
    if (status) filter.status = status;
    if (ip) filter.ip = ip;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const logs = await this.find(filter)
      .populate("user", "name email role")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Count total matching documents
    const total = await this.countDocuments(filter);

    return {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  } catch (err) {
    console.error("Error searching logs:", err);
    throw err;
  }
};

/**
 * 📊 Static method to get activity statistics
 */
LogSchema.statics.getStats = async function ({
  days = 7,
  userId = null
} = {}) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const match = {
      createdAt: { $gte: startDate }
    };

    if (userId) {
      match.user = mongoose.Types.ObjectId.createFromHexString(userId);
    }

    const stats = await this.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  } catch (err) {
    console.error("Error getting stats:", err);
    throw err;
  }
};

module.exports = mongoose.model("Log", LogSchema);
