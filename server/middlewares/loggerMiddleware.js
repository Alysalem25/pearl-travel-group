/**
 * 📝 Request Logging Middleware
 * 
 * Optional middleware to automatically log all requests.
 * Can be applied globally or to specific routes.
 * 
 * Usage:
 * app.use(requestLogger());  // Global
 * app.get("/api/users", requestLogger(), getUsersController);  // Specific route
 * 
 * Security:
 * - Excludes sensitive routes (passwords, tokens)
 * - Doesn't log request/response bodies by default
 * - Tracks request duration
 */

const { createLog } = require("../utils/loggerService");

/**
 * Routes that should NOT be logged
 * (to avoid logging sensitive data)
 */
const EXCLUDED_ROUTES = [
  /^\/api\/auth\/login$/,
  /^\/api\/auth\/register$/,
  /^\/api\/auth\/refresh/,
  /^\/uploads\//,
  /^\/health/,
  /\.js$/,
  /\.css$/,
  /\.map$/,
  /favicon/
];

/**
 * Check if route should be logged
 */
const shouldLog = (path) => {
  return !EXCLUDED_ROUTES.some(pattern => pattern.test(path));
};

/**
 * 🔍 Request Logger Middleware
 * 
 * Logs HTTP requests with timing information
 * Can attach to Express app or specific routes
 */
const requestLogger = (options = {}) => {
  const {
    detailed = false,
    logBodies = false
  } = options;

  return async (req, res, next) => {
    // Skip logging for excluded routes
    if (!shouldLog(req.path)) {
      return next();
    }

    const startTime = Date.now();

    // Intercept response end to log after response
    const originalEnd = res.end;

    res.end = async function (...args) {
      const duration = Date.now() - startTime;

      // Only log if response was sent
      if (res.writableEnded) {
        return originalEnd.apply(res, args);
      }

      try {
        // Determine action based on route
        let action = "REQUEST";
        let entity = "System";

        // Parse route to determine entity type
        if (req.path.includes("/users")) {
          entity = "User";
          action = `${req.method}_USER`;
        } else if (req.path.includes("/programs")) {
          entity = "Program";
          action = `${req.method}_PROGRAM`;
        } else if (req.path.includes("/categories")) {
          entity = "Category";
          action = `${req.method}_CATEGORY`;
        } else if (req.path.includes("/countries")) {
          entity = "Country";
          action = `${req.method}_COUNTRY`;
        } else if (req.path.includes("/cruises")) {
          entity = "Cruise";
          action = `${req.method}_CRUISE`;
        } else if (req.path.includes("/bookings")) {
          entity = "Booking";
          action = `${req.method}_BOOKING`;
        }

        // Determine status
        const status = res.statusCode >= 400 ? "failed" : "success";

        // Get details
        const details = detailed ? {
          statusCode: res.statusCode,
          contentLength: res.get("content-length")
        } : null;

        // Create log
        await createLog({
          userId: req.user?._id || null,
          action,
          entity,
          status,
          req,
          statusCode: res.statusCode,
          errorMessage: status === "failed" ? "HTTP error" : null,
          details,
          duration
        });
      } catch (err) {
        console.error("Error in request logger middleware:", err);
      }

      // Call original end
      originalEnd.apply(res, args);
    };

    next();
  };
};

/**
 * 🛡️ Middleware to log failed requests only
 * Lighter weight - only logs errors and suspicious activity
 */
const errorRequestLogger = () => {
  return (req, res, next) => {
    const startTime = Date.now();
    const originalEnd = res.end;

    res.end = async function (...args) {
      const duration = Date.now() - startTime;

      try {
        // Only log failed requests
        if (res.statusCode >= 400) {
          await createLog({
            userId: req.user?._id || null,
            action: `ERROR_${req.method}`,
            entity: "System",
            status: "failed",
            req,
            statusCode: res.statusCode,
            errorMessage: `HTTP ${res.statusCode}`,
            duration
          });
        }
      } catch (err) {
        console.error("Error in error logger middleware:", err);
      }

      originalEnd.apply(res, args);
    };

    next();
  };
};

/**
 * 📊 Middleware to measure and log slow requests
 * Useful for performance monitoring
 */
const slowRequestLogger = (slowThresholdMs = 1000) => {
  return (req, res, next) => {
    const startTime = Date.now();
    const originalEnd = res.end;

    res.end = async function (...args) {
      const duration = Date.now() - startTime;

      if (duration > slowThresholdMs) {
        try {
          await createLog({
            userId: req.user?._id || null,
            action: "SLOW_REQUEST",
            entity: "System",
            status: "success",
            req,
            statusCode: res.statusCode,
            details: {
              threshold: slowThresholdMs,
              actualDuration: duration
            },
            duration
          });
        } catch (err) {
          console.error("Error in slow request logger:", err);
        }
      }

      originalEnd.apply(res, args);
    };

    next();
  };
};

module.exports = {
  requestLogger,
  errorRequestLogger,
  slowRequestLogger
};
