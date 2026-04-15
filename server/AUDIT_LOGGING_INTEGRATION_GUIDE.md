/**
 * 📝 AUDIT LOGGING INTEGRATION GUIDE - AUTH ROUTES
 * 
 * This file shows you EXACTLY WHERE and HOW to add logging to your existing auth routes.
 * Copy-paste the relevant sections marked with "🔹 ADD THIS" into your actual authRoutes.js
 * 
 * ============================================================================
 * STEP 1: Add this import at the TOP of authRoutes.js
 * ============================================================================
 * 
 * const { logSuccess, logError, checkSuspiciousActivity } = require("../utils/loggerService");
 * 
 * ============================================================================
 * STEP 2: Register Endpoint - Add logging in 3 places
 * ============================================================================
 */

// ✅ EXISTING CODE (no changes needed)
// router.post(
//   "/register",
//   uploadUser.array("images", 1),
//   validateRegister,
//   handleValidationErrors,
//   async (req, res, next) => {
//     try {
//       const { name, email, password, number, role, ... } = req.body;

//       // ✅ EXISTING: Check if user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         // 🔹 ADD THIS - Log failed registration (email already exists)
//         // await logError(null, "REGISTER_FAILED", "User", req, "Email already registered", { email });
//
//         return res.status(400).json({ error: "Email already registered" });
//       }

//       // ✅ EXISTING: Create user (all your existing logic)
//       const user = new User({ ... });
//       await user.save();
//       const token = jwt.sign(...);

//       // 🔹 ADD THIS - Log successful registration
//       // await logSuccess(user._id, "REGISTER_SUCCESS", "User", user._id, req, { email: user.email });

//       res.status(201).json({ message: "User registered successfully", token, user: response });
//     } catch (err) {
//       // 🔹 ADD THIS - Log registration error
//       // await logError(null, "REGISTER_FAILED", "User", req, err.message);
//       next(err);
//     }
//   }
// );

/**
 * ============================================================================
 * STEP 3: Login Endpoint - Add logging in 4 places
 * ============================================================================
 */

// ✅ EXAMPLE INTEGRATION (replace your existing login handler)
//
// router.post("/login", validateLogin, handleValidationErrors, async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//
//     // 🔹 CHECK FOR BRUTE FORCE (optional but recommended for security)
//     // const suspiciousCheck = await checkSuspiciousActivity(
//     //   getIPAddress(req),
//     //   "LOGIN_FAILED",
//     //   5,
//     //   15
//     // );
//     // if (suspiciousCheck.isSuspicious) {
//     //   // 🔹 LOG: Too many failed attempts
//     //   // await logError(null, "LOGIN_FAILED", "User", req, "Too many failed attempts", { email, attempt: suspiciousCheck.failedAttempts });
//     //   return res.status(429).json({ error: "Too many failed login attempts. Try again later." });
//     // }
//
//     // ✅ EXISTING: Find user
//     const user = await User.findOne({ email }).select("+password");
//
//     if (!user) {
//       // 🔹 LOG: User not found (failed login)
//       // await logError(null, "LOGIN_FAILED", "User", req, "User not found", { email });
//
//       return res.status(401).json({ error: "Invalid email or password" });
//     }
//
//     if (user.role === "user") {
//       // 🔹 LOG: User account access denied (only staff can log in)
//       // await logError(user._id, "LOGIN_FAILED", "User", req, "Invalid user role", { role: user.role });
//
//       return res.status(500).json({ error: "Account configuration error" });
//     }
//
//     // ✅ EXISTING: Validate password
//     const isPasswordValid = await user.comparePassword(password);
//
//     if (!isPasswordValid) {
//       // 🔹 LOG: Wrong password (failed login)
//       // await logError(user._id, "LOGIN_FAILED", "User", req, "Invalid password");
//
//       return res.status(401).json({ error: "Invalid email or password" });
//     }
//
//     // ✅ EXISTING: Generate JWT
//     const token = jwt.sign(
//       { id: user._id.toString(), role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE || "7d" }
//     );
//
//     // 🔹 LOG: Successful login
//     // await logSuccess(user._id, "LOGIN_SUCCESS", "User", user._id, req, { email: user.email, role: user.role });
//
//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });
//
//   } catch (err) {
//     // 🔹 LOG: Server error during login
//     // await logError(null, "LOGIN_FAILED", "User", req, `Server error: ${err.message}`);
//     console.error("Login error:", err);
//     next(err);
//   }
// });

/**
 * ============================================================================
 * STEP 4: Logout Endpoint (if you have one)
 * ============================================================================
 * 
 * router.post("/logout", authMiddleware, async (req, res, next) => {
 *   try {
 *     // 🔹 LOG: User logout
 *     // await logSuccess(req.user._id, "LOGOUT", "User", req.user._id, req);
 *
 *     // Your logout logic here (e.g., blacklist token)
 *
 *     res.json({ message: "Logged out successfully" });
 *   } catch (err) {
 *     // 🔹 LOG: Logout failed
 *     // await logError(req.user._id, "LOGOUT", "User", req, err.message);
 *     next(err);
 *   }
 * });
 */

/**
 * ============================================================================
 * COPY-PASTE THE ACTUAL IMPLEMENTATION BELOW
 * ============================================================================
 * 
 * To use this guide:
 * 1. Open your actual authRoutes.js file
 * 2. Add the import at the top: const { logSuccess, logError, checkSuspiciousActivity } = require("../utils/loggerService");
 * 3. Find each handler function and add the logging calls where marked "🔹 ADD THIS"
 * 4. Uncomment the logging lines (remove //)
 * 5. Test thoroughly!
 * 
 * ============================================================================
 */

/**
 * 📋 QUICK REFERENCE - Available Logging Functions
 */

// Most common:
// await logSuccess(userId, action, entity, entityId, req, details);
// await logError(userId, action, entity, req, errorMessage, details);

// Examples:
// ✅ await logSuccess(user._id, "LOGIN_SUCCESS", "User", user._id, req, { email });
// ❌ await logError(null, "LOGIN_FAILED", "User", req, "Invalid credentials");
// ✅ await logSuccess(user._id, "REGISTER_SUCCESS", "User", user._id, req);
// ❌ await logError(userId, "DELETE_USER", "User", req, "Permission denied");

/**
 * 📊 ACTIONS TO LOG IN AUTH
 * 
 * LOGIN_SUCCESS      - User logged in successfully
 * LOGIN_FAILED       - Failed login attempt (wrong password, user not found)
 * LOGOUT             - User logged out
 * REGISTER_SUCCESS   - New user registered
 * REGISTER_FAILED    - Registration failed (email exists, validation error)
 * PASSWORD_RESET     - User reset password
 * TOKEN_REFRESH      - Token refreshed
 */

module.exports = {
  _guide: "See comments above for integration instructions"
};
