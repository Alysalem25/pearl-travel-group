/**
 * 📋 AUDIT LOGS API ROUTES
 * 
 * Admin-only endpoints for viewing, filtering, and analyzing audit logs.
 * Every endpoint requires authentication + admin or manage_logs permission.
 * 
 * Routes:
 * GET    /api/logs                - Get all logs (filtered, paginated)
 * GET    /api/logs/stats          - Get activity statistics
 * GET    /api/logs/suspicious     - Get suspicious activity
 * GET    /api/logs/:id            - Get specific log
 * DELETE /api/logs/delete-old     - Delete logs older than X days (admin only)
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const Log = require("../models/Log");
const { logSuccess, logError } = require("../utils/loggerService");

const router = express.Router();

/**
 * ============================================================================
 * 🔐 MIDDLEWARE: Ensure user is admin or has manage_logs permission
 * ============================================================================
 */

const requireAdminOrLogs = authorize("admin", "manage_logs");

/**
 * ============================================================================
 * GET /api/logs
 * 
 * Fetch audit logs with filtering, sorting, and pagination
 * 
 * Query Parameters:
 * - userId:    Filter by user ID
 * - action:    Filter by action (e.g., LOGIN_SUCCESS, CREATE_USER)
 * - entity:    Filter by entity type (e.g., User, Program)
 * - status:    Filter by status (success, failed)
 * - ip:        Filter by IP address
 * - startDate: Filter by date range (ISO string)
 * - endDate:   Filter by date range (ISO string)
 * - page:      Page number (default: 1)
 * - limit:     Records per page (default: 20, max: 100)
 * - sortBy:    Sort field (default: createdAt)
 * - sortOrder: Sort order (1 for ASC, -1 for DESC, default: -1)
 * 
 * Response:
 * {
 *   "logs": [...],
 *   "pagination": {
 *     "total": 1500,
 *     "page": 1,
 *     "limit": 20,
 *     "pages": 75
 *   }
 * }
 * ============================================================================
 */
router.get("/", authMiddleware, requireAdminOrLogs, async (req, res, next) => {
  try {
    const {
      userId,
      action,
      entity,
      status,
      ip,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = -1
    } = req.query;

    // Validate and limit page size (prevent DOS attacks)
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const parsedSortOrder = parseInt(sortOrder) === 1 ? 1 : -1;

    // Use the Log model's searchLogs static method
    const result = await Log.searchLogs({
      userId,
      action,
      entity,
      status,
      ip,
      startDate,
      endDate,
      page: parsedPage,
      limit: parsedLimit,
      sortBy,
      sortOrder: parsedSortOrder
    });

    // 🔹 Log this admin action
    await logSuccess(
      req.user._id,
      "ADMIN_ACCESS",
      "System",
      null,
      req,
      {
        resource: "logs",
        filters: { userId, action, entity, status, ip },
        page: parsedPage,
        limit: parsedLimit
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching logs:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * GET /api/logs/stats
 * 
 * Get activity statistics for a time period
 * 
 * Query Parameters:
 * - days:     Number of days to analyze (default: 7)
 * - userId:   Optional - get stats for specific user
 * 
 * Response:
 * [
 *   {
 *     "_id": "LOGIN_SUCCESS",
 *     "count": 150,
 *     "successCount": 150,
 *     "failedCount": 0
 *   },
 *   ...
 * ]
 * ============================================================================
 */
router.get("/stats", authMiddleware, requireAdminOrLogs, async (req, res, next) => {
  try {
    const { days = 7, userId } = req.query;

    const stats = await Log.getStats({
      days: parseInt(days) || 7,
      userId: userId || null
    });

    // 🔹 Log this admin action
    await logSuccess(
      req.user._id,
      "ADMIN_ACCESS",
      "System",
      null,
      req,
      {
        resource: "logs/stats",
        days: parseInt(days) || 7,
        userId: userId || "all"
      }
    );

    res.json({
      stats,
      period: {
        days: parseInt(days) || 7,
        from: new Date(Date.now() - (parseInt(days) || 7) * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * GET /api/logs/suspicious
 * 
 * Get potentially suspicious activity:
 * - Multiple failed login attempts from same IP
 * - Multiple permission denied attempts
 * - Failed operations in short time span
 * 
 * Query Parameters:
 * - withinMinutes: Time window to check (default: 30)
 * - threshold:    Min failed attempts to consider suspicious (default: 5)
 * ============================================================================
 */
router.get("/suspicious", authMiddleware, requireAdminOrLogs, async (req, res, next) => {
  try {
    const withinMinutes = parseInt(req.query.withinMinutes) || 30;
    const threshold = parseInt(req.query.threshold) || 5;
    const since = new Date(Date.now() - withinMinutes * 60 * 1000);

    // Find IPs with many failed attempts
    const suspiciousByIP = await Log.aggregate([
      {
        $match: {
          status: "failed",
          createdAt: { $gte: since },
          ip: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$ip",
          failedAttempts: { $sum: 1 },
          actions: { $push: "$action" },
          lastAttempt: { $max: "$createdAt" }
        }
      },
      {
        $match: {
          failedAttempts: { $gte: threshold }
        }
      },
      {
        $sort: { failedAttempts: -1 }
      }
    ]);

    // Find users with many permission denied attempts
    const suspiciousByUser = await Log.aggregate([
      {
        $match: {
          action: "PERMISSION_DENIED",
          createdAt: { $gte: since },
          user: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$user",
          deniedAttempts: { $sum: 1 },
          lastAttempt: { $max: "$createdAt" }
        }
      },
      {
        $match: {
          deniedAttempts: { $gte: threshold }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $sort: { deniedAttempts: -1 }
      }
    ]);

    // 🔹 Log this admin action
    await logSuccess(
      req.user._id,
      "ADMIN_ACCESS",
      "System",
      null,
      req,
      {
        resource: "logs/suspicious",
        withinMinutes,
        threshold
      }
    );

    res.json({
      suspiciousByIP,
      suspiciousByUser,
      analysis: {
        withinMinutes,
        threshold,
        since
      }
    });
  } catch (err) {
    console.error("Error getting suspicious activity:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * GET /api/logs/:id
 * 
 * Get specific log entry with full details
 * ============================================================================
 */
router.get("/:id", authMiddleware, requireAdminOrLogs, async (req, res, next) => {
  try {
    const log = await Log.findById(req.params.id).populate("user", "name email role");

    if (!log) {
      await logError(req.user._id, "ADMIN_ACCESS", "System", req, "Log not found", { logId: req.params.id });
      return res.status(404).json({ error: "Log not found" });
    }

    // 🔹 Log this admin action
    await logSuccess(
      req.user._id,
      "ADMIN_ACCESS",
      "System",
      null,
      req,
      {
        resource: "logs/:id",
        logId: req.params.id
      }
    );

    res.json({ log });
  } catch (err) {
    console.error("Error fetching log:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * POST /api/logs/export
 * 
 * Export logs as JSON/CSV (admin only, very sensitive)
 * Request body:
 * {
 *   "format": "json" | "csv",
 *   "filters": { userId, action, entity, status, startDate, endDate },
 *   "fields": ["user", "action", "entity", "status", "ip", "createdAt"]
 * }
 * ============================================================================
 */
router.post("/export", authMiddleware, authorize("admin"), async (req, res, next) => {
  try {
    const { format = "json", filters = {}, fields = null } = req.body;

    // Build query
    const query = {};
    if (filters.userId) query.user = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.entity) query.entity = filters.entity;
    if (filters.status) query.status = filters.status;

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    // Limit export to 50,000 records
    const logs = await Log.find(query)
      .populate("user", "name email role")
      .limit(50000);

    // 🔹 Log this sensitive admin action
    await logSuccess(
      req.user._id,
      "ADMIN_EXPORT_DATA",
      "System",
      null,
      req,
      {
        format,
        recordCount: logs.length,
        filters
      }
    );

    if (format === "csv") {
      // Simple CSV export
      const csv = convertLogsToCSV(logs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="audit_logs_${Date.now()}.csv"`);
      res.send(csv);
    } else {
      // JSON export
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="audit_logs_${Date.now()}.json"`);
      res.json({ logs, exportedAt: new Date(), count: logs.length });
    }
  } catch (err) {
    console.error("Error exporting logs:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * DELETE /api/logs/delete-old
 * 
 * Delete logs older than specified days (admin only, very dangerous)
 * Request body:
 * {
 *   "daysBefore": 90,
 *   "action": "confirm"  // Must be "confirm" to proceed
 * }
 * ============================================================================
 */
router.delete("/delete-old", authMiddleware, authorize("admin"), async (req, res, next) => {
  try {
    const { daysBefore = 90, action } = req.body;

    // Safety check - require explicit confirmation
    if (action !== "confirm") {
      return res.status(400).json({
        error: "Operation requires confirmation",
        message: 'Include "action": "confirm" in request body'
      });
    }

    const before = new Date();
    before.setDate(before.getDate() - daysBefore);

    const result = await Log.deleteMany({
      createdAt: { $lt: before }
    });

    // 🔹 Log this very sensitive admin action
    await logSuccess(
      req.user._id,
      "ADMIN_BULK_DELETE",
      "System",
      null,
      req,
      {
        resource: "logs",
        daysBefore,
        deletedCount: result.deletedCount,
        warning: "BULK DELETE OPERATION"
      }
    );

    res.json({
      message: "Old logs deleted successfully",
      deletedCount: result.deletedCount,
      deletedBefore: before
    });
  } catch (err) {
    console.error("Error deleting logs:", err);
    next(err);
  }
});

/**
 * ============================================================================
 * HELPER FUNCTION: Convert logs to CSV
 * ============================================================================
 */
function convertLogsToCSV(logs) {
  if (logs.length === 0) return "No logs";

  // Headers
  const headers = [
    "Timestamp",
    "User",
    "Email",
    "Action",
    "Entity",
    "Status",
    "IP Address",
    "HTTP Status",
    "Error Message"
  ];

  // Data rows
  const rows = logs.map(log => [
    log.createdAt.toISOString(),
    log.user?.name || "Guest",
    log.user?.email || "-",
    log.action,
    log.entity,
    log.status,
    log.ip || "-",
    log.statusCode || "-",
    log.errorMessage || "-"
  ]);

  // Combine headers and rows
  const allRows = [headers, ...rows];

  // Convert to CSV (simple - doesn't escape quotes)
  return allRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
}

module.exports = router;
