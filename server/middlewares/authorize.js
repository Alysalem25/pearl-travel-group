const { hasPermission } = require("../utils/permission");

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    // 1. Check if user exists (should be populated by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found in request" });
    }

    // 2. Check if user has permission
    if (!hasPermission(req.user, requiredPermission)) {
      return res.status(403).json({ error: "Forbidden: You do not have the required permissions" });
    }

    next();
  };
};

module.exports = authorize;
