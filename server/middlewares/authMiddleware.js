const jwt = require("jsonwebtoken");
const User = require("../models/Users");

/**
 * Authentication Middleware
 * Verifies JWT token and extracts full user information from the database.
 * 
 * Security: Only allows Bearer token format, validates JWT signature
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Authorization header missing" 
      });
    }

    // Verify Bearer token format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ 
        error: "Invalid authorization format" 
      });
    }

    const token = parts[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user to attach permissions and role
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Attach user info to request object for downstream handlers
    req.user = user;

    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
