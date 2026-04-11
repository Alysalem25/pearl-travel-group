/**
 * 📝 USER MANAGEMENT ROUTES - LOGGING INTEGRATION EXAMPLES
 * 
 * This file shows how to add logging to your user management (CRUD) endpoints.
 * Copy-paste these examples into your userRoutes.js or relevant route files.
 * 
 * The pattern is the same for all route integrations:
 * 1. Add the import at the top
 * 2. Add logSuccess/logError calls at appropriate points
 * 3. Test thoroughly
 */

// ============================================================================
// STEP 1: Add this import at the TOP of your routes file
// ============================================================================
// const { logSuccess, logError, logPermissionDenied } = require("../utils/loggerService");

// ============================================================================
// EXAMPLE 1: POST /api/users (Create User)
// ============================================================================

// router.post("/", authMiddleware, authorize("admin", "manage_users"), async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;
//
//     // Validate input
//     if (!name || !email || !password) {
//       // 🔹 Log failed user creation
//       // await logError(req.user._id, "CREATE_USER", "User", req, "Missing required fields", { fields: "name, email, password" });
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       // 🔹 Log failed user creation (email exists)
//       // await logError(req.user._id, "CREATE_USER", "User", req, "Email already exists", { email });
//       return res.status(400).json({ error: "Email already exists" });
//     }
//
//     // Create user
//     const user = new User({ name, email, password, role });
//     await user.save();
//
//     // 🔹 Log successful user creation
//     // await logSuccess(req.user._id, "CREATE_USER", "User", user._id, req, {
//     //   createdUserEmail: email,
//     //   role,
//     //   createdUserName: name
//     // });
//
//     res.status(201).json({ message: "User created successfully", user });
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "CREATE_USER", "User", req, err.message);
//     next(err);
//   }
// });

// ============================================================================
// EXAMPLE 2: GET /api/users/:id (Get User)
// ============================================================================

// router.get("/:id", authMiddleware, async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//
//     if (!user) {
//       // 🔹 Log not found
//       // await logError(req.user._id, "REQUEST", "User", req, "User not found", { targetUserId: req.params.id });
//       return res.status(404).json({ error: "User not found" });
//     }
//
//     // No logging needed for successful GET (too verbose)
//     res.json({ user });
//   } catch (err) {
//     // await logError(req.user._id, "REQUEST", "User", req, err.message);
//     next(err);
//   }
// });

// ============================================================================
// EXAMPLE 3: PUT /api/users/:id (Update User)
// ============================================================================

// router.put("/:id", authMiddleware, authorize("admin", "manage_users"), async (req, res, next) => {
//   try {
//     const { name, email, role } = req.body;
//     const updateData = {};
//
//     // Only update provided fields
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (role) updateData.role = role;
//
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     ).select("-password");
//
//     if (!user) {
//       // 🔹 Log failed update
//       // await logError(req.user._id, "UPDATE_USER", "User", req, "User not found", { targetUserId: req.params.id });
//       return res.status(404).json({ error: "User not found" });
//     }
//
//     // 🔹 Log successful update
//     // await logSuccess(req.user._id, "UPDATE_USER", "User", user._id, req, {
//     //   updatedUserEmail: user.email,
//     //   changedFields: Object.keys(updateData)
//     // });
//
//     res.json({ message: "User updated successfully", user });
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "UPDATE_USER", "User", req, err.message);
//     next(err);
//   }
// });

// ============================================================================
// EXAMPLE 4: DELETE /api/users/:id (Delete User)
// ============================================================================

// router.delete("/:id", authMiddleware, authorize("admin", "manage_users"), async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//
//     if (!user) {
//       // 🔹 Log failed delete
//       // await logError(req.user._id, "DELETE_USER", "User", req, "User not found", { targetUserId: req.params.id });
//       return res.status(404).json({ error: "User not found" });
//     }
//
//     // 🔹 Log successful delete
//     // await logSuccess(req.user._id, "DELETE_USER", "User", req.params.id, req, {
//     //   deletedUserEmail: user.email,
//     //   deletedUserName: user.name
//     // });
//
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "DELETE_USER", "User", req, err.message);
//     next(err);
//   }
// });

// ============================================================================
// EXAMPLE 5: Logging for Other Resources (Programs, Categories, etc.)
// ============================================================================

// /** CREATE PROGRAM **/
// router.post("/", authMiddleware, authorize("admin"), async (req, res, next) => {
//   try {
//     const program = new Program(req.body);
//     await program.save();
//     // 🔹 Log success
//     // await logSuccess(req.user._id, "CREATE_PROGRAM", "Program", program._id, req, {
//     //   programName: program.name,
//     //   price: program.price
//     // });
//     res.status(201).json(program);
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "CREATE_PROGRAM", "Program", req, err.message);
//     next(err);
//   }
// });
//
// /** UPDATE PROGRAM **/
// router.put("/:id", authMiddleware, authorize("admin"), async (req, res, next) => {
//   try {
//     const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!program) return res.status(404).json({ error: "Program not found" });
//     // 🔹 Log success
//     // await logSuccess(req.user._id, "UPDATE_PROGRAM", "Program", program._id, req, {
//     //   programName: program.name
//     // });
//     res.json(program);
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "UPDATE_PROGRAM", "Program", req, err.message);
//     next(err);
//   }
// });
//
// /** DELETE PROGRAM **/
// router.delete("/:id", authMiddleware, authorize("admin"), async (req, res, next) => {
//   try {
//     const program = await Program.findByIdAndDelete(req.params.id);
//     if (!program) return res.status(404).json({ error: "Program not found" });
//     // 🔹 Log success
//     // await logSuccess(req.user._id, "DELETE_PROGRAM", "Program", req.params.id, req, {
//     //   programName: program.name
//     // });
//     res.json({ message: "Program deleted" });
//   } catch (err) {
//     // 🔹 Log error
//     // await logError(req.user._id, "DELETE_PROGRAM", "Program", req, err.message);
//     next(err);
//   }
// });

// ============================================================================
// BEST PRACTICES FOR LOGGING
// ============================================================================

/**
 * 📋 WHEN TO LOG
 * 
 * ✅ DO LOG:
 * - CREATE operations (always)
 * - UPDATE operations (always)
 * - DELETE operations (always)
 * - Authentication events (login success/failure)
 * - Permission denied attempts
 * - Admin actions
 * - Failed operations with errors
 * 
 * ❌ DON'T LOG:
 * - Every GET request (too verbose, bloats database)
 * - Health check endpoints
 * - Non-sensitive operations
 * - Successful operations if they happen frequently (e.g., every API call)
 */

/**
 * 📋 WHAT TO INCLUDE IN DETAILS
 * 
 * ✅ SAFE TO LOG:
 * - Entity names (user name, program title)
 * - Entity IDs
 * - Email addresses (not in passwords)
 * - Action results and counts
 * - Changed fields (what was modified)
 * - IP addresses (for security)
 * - Timestamps
 * 
 * ❌ NEVER LOG:
 * - Passwords
 * - Tokens or JWT
 * - API Keys or Secrets
 * - Credit card numbers
 * - Social Security Numbers
 * - Personal data like phone numbers (in most cases)
 * - Sensitive PII
 */

/**
 * 📋 ACTION NAMING CONVENTION
 * 
 * Use UPPERCASE_SNAKE_CASE:
 * - LOGIN_SUCCESS, LOGIN_FAILED
 * - CREATE_USER, UPDATE_USER, DELETE_USER
 * - CREATE_PROGRAM, UPDATE_PROGRAM, DELETE_PROGRAM
 * - PERMISSION_DENIED
 * - ADMIN_ACCESS (for admin-only endpoints)
 */

/**
 * 📋 ERROR HANDLING
 * 
 * Always wrap logging in try/catch:
 * - Never let logging errors crash the app
 * - The logError/logSuccess functions already handle this
 * - Check console for logging errors
 */

// ============================================================================
// COMPLETE INTEGRATION CHECKLIST
// ============================================================================
/**
 * 
 * ✅ CHECKLIST FOR COMPLETE INTEGRATION:
 * 
 * BACKEND:
 * - [ ] Create Log model (/server/models/Log.js)
 * - [ ] Create logger service (/server/utils/loggerService.js)
 * - [ ] Create logger middleware (/server/middlewares/loggerMiddleware.js)
 * - [ ] Import loggerService in authRoutes.js
 * - [ ] Add logging to auth: LOGIN_SUCCESS, LOGIN_FAILED, REGISTER_SUCCESS, PASSWORD_RESET
 * - [ ] Add logging to auth: DELETE_USER (admin action)
 * - [ ] Import loggerService in userRoutes.js
 * - [ ] Add logging to user CRUD operations
 * - [ ] Import loggerService in programRoutes.js
 * - [ ] Add logging to program CRUD operations
 * - [ ] Import loggerService in other route files (categories, countries, flights, etc.)
 * - [ ] Add logging to other CRUD operations
 * - [ ] Create logs API routes (/server/routes/logsRoutes.js)
 * - [ ] Register logs routes in index.js
 * - [ ] Test: POST /api/logs (ensure routes loads)
 * - [ ] Test: GET /api/logs?limit=10 (check auth middleware works)
 * - [ ] Test: GET /api/logs/stats (check stats work)
 * 
 * DATABASE:
 * - [ ] Ensure MongoDB is running
 * - [ ] Verify Log collection was created
 * - [ ] Test: Insert test log manually via MongoDB
 * 
 * FRONTEND:
 * - [ ] Create logs page (/client/app/Admindashbord/logs/page.tsx)
 * - [ ] Test: Can access /admin/logs (with auth)
 * - [ ] Test: Logs table loads data
 * - [ ] Test: Filters work correctly
 * - [ ] Test: Pagination works
 * - [ ] Test: Export to CSV works
 * - [ ] Test: Stats tab loads
 * - [ ] Test: Suspicious activity tab loads
 * 
 * TESTING:
 * - [ ] Perform a login and verify log was created
 * - [ ] Perform a failed login and verify log was created
 * - [ ] Create a new user and verify log was created
 * - [ ] Delete a user and verify log was created
 * - [ ] View logs in admin dashboard
 * - [ ] Filter logs by action
 * - [ ] Filter logs by date range
 * - [ ] Export logs to CSV
 * - [ ] Check suspicious activity detection
 * 
 * SECURITY:
 * - [ ] Verify logs endpoint requires auth
 * - [ ] Verify logs endpoint requires admin role
 * - [ ] Verify passwords are NOT logged
 * - [ ] Verify tokens are NOT logged
 * - [ ] Verify sensitive data is sanitized
 * - [ ] Test brute force detection (5 failed logins in 15 mins)
 * - [ ] Verify failed logs are created for permission denied
 * 
 * PERFORMANCE:
 * - [ ] Check that logging doesn't block requests
 * - [ ] Monitor database size of logs collection
 * - [ ] Configure TTL index if needed (delete logs after 90 days)
 * - [ ] Test pagination with large datasets
 * 
 * DOCUMENTATION:
 * - [ ] Document all actions logged
 * - [ ] Document API endpoints
 * - [ ] Document filter options
 * - [ ] Train team on using admin dashboard
 */

module.exports = {
  _guide: "See comments for integration examples and best practices"
};
