/**
 * Authorization Middleware (Role and Permission-Based Access Control)
 * Checks if user has required role or permission to access route
 * 
 * Usage: app.delete('/categories/:id', authMiddleware, authorize('admin', 'delete_category'), deleteCategory)
 * 
 * Security Principle: Backend always enforces authorization - never trust frontend
 */

const { hasPermission } = require("../utils/permission");

const authorize = (...allowedRequirements) => {
  return (req, res, next) => {
    // authMiddleware must be used before this middleware
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user's role is in the list, OR if they have the permission
    const hasRole = allowedRequirements.includes(req.user.role);
    const userHasPerm = allowedRequirements.some(reqString => hasPermission(req.user, reqString));

    if (!hasRole && !userHasPerm) {
      return res.status(403).json({ 
        error: "Forbidden: insufficient permissions",
        requiredRequirements: allowedRequirements,
        userRole: req.user.role
      });
    }

    next();
  };
};

module.exports = authorize;
