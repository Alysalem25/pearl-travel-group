# Permission System Audit

## ✅ AVAILABLE PERMISSIONS

### Programs
- `add_program` - Create programs
- `edit_program` - Edit programs
- `delete_program` - Delete programs
- `manage_booked_programs` - Manage booked programs

### Categories
- `add_category` - Create categories
- `edit_category` - Edit categories
- `delete_category` - Delete categories

### Cruises
- `add_cruise` - Create cruises
- `edit_cruise` - Edit cruises
- `delete_cruise` - Delete cruises
- `manage_booked_cruises` - Manage booked cruises

### Countries
- `add_country` - Create countries
- `edit_country` - Edit countries
- `delete_country` - Delete countries

### Users
- `manage_users` - Manage users (all operations)

### Flights
- `manage_booked_flights` - Manage booked flights

### Hotels
- `manage_booked_hotels` - Manage booked hotels

### Transportation
- `manage_booked_transportation` - Manage booked transportation

### Visa
- `manage_visa` - Manage visa

### Full Access
- `*` - Admin unrestricted access

---

## ⚠️ PROBLEM FOUND: INCONSISTENT AUTHORIZATION

### ✅ ROUTES USING PERMISSION-BASED AUTHORIZATION (CORRECT)
```
programRoutes.js:
  POST   /api/programs              → authorize("add_program")
  PUT    /api/programs/:id          → authorize("edit_program")
  DELETE /api/programs/:id          → authorize("delete_program")

categoryRoutes.js:
  POST   /api/categories            → authorize("add_category")
  PUT    /api/categories/:id        → authorize("edit_category")
  DELETE /api/categories/:id        → authorize("delete_category")

userRoutes.js:
  GET    /api/users                 → authorize("manage_users")
  POST   /api/users                 → authorize("manage_users")
  PUT    /api/users/:id             → authorize("manage_users")
  DELETE /api/users/:id             → authorize("manage_users")
```

### ❌ ROUTES USING ROLE-BASED AUTHORIZATION (INCORRECT - SHOULD USE PERMISSIONS)
```
countryRoutes.js:
  POST   /api/countries             → authorize("admin") ❌ SHOULD BE "add_country"
  PUT    /api/countries/:id         → authorize("admin") ❌ SHOULD BE "edit_country"
  DELETE /api/countries/:id         → authorize("admin") ❌ SHOULD BE "delete_country"

cruiseRoutes.js:
  POST   /api/cruises               → authorize("admin") ❌ SHOULD BE "add_cruise"
  PUT    /api/cruises/:id           → authorize("admin") ❌ SHOULD BE "edit_cruise"
  DELETE /api/cruises/:id           → authorize("admin") ❌ SHOULD BE "delete_cruise"

flightRoutes.js:
  GET    /api/flights               → authorize("admin") ❌ SHOULD USE PERMISSIONS
  DELETE /api/flights/:id           → authorize("admin") ❌ SHOULD USE PERMISSIONS
  PUT    /api/flights/:id/status    → authorize("admin") ❌ SHOULD USE PERMISSIONS

hotelRoutes.js:
  DELETE /api/hotels/:id            → authorize("admin") ❌ SHOULD USE PERMISSIONS
  PUT    /api/hotels/:id/status     → authorize("admin") ❌ SHOULD USE PERMISSIONS

carTrip.js:
  DELETE /api/car-trips/:id         → authorize("admin") ❌ SHOULD USE PERMISSIONS
  PUT    /api/car-trips/:id/status  → authorize("admin") ❌ SHOULD USE PERMISSIONS

visaRoutes.js:
  GET    /api/visa                  → authorize("admin") ❌ SHOULD BE "manage_visa"
  PUT    /api/visa/:id              → authorize("admin") ❌ SHOULD BE "manage_visa"
  DELETE /api/visa/:id              → authorize("admin") ❌ SHOULD BE "manage_visa"

eventRouter.js:
  POST   /api/events                → authorize("admin") ❌ SHOULD USE PERMISSIONS
  PUT    /api/events/:id            → authorize("admin") ❌ SHOULD USE PERMISSIONS
  DELETE /api/events/:id            → authorize("admin") ❌ SHOULD USE PERMISSIONS
```

---

## 🔴 THE ISSUE YOU'RE FACING

When you grant a user permissions like `add_program`, they:
- ✅ CAN access the `/api/programs` POST endpoint (from programRoutes.js)
- ❌ CANNOT access the programs admin page because routes like `countryRoutes.js` only check for role="admin"

### Why Frontend Permissions Aren't Working on Admin Pages:

1. **Frontend** works correctly:
   - Uses `<ProtectedRoute requiredPermission="add_program">`
   - Checks `user.permissions.includes("add_program")`
   - ✅ Allows user with `add_program` permission to see the page

2. **Backend** blocks the request:
   - Uses `authorize("admin")` (role-based, not permission-based)
   - Only allows users with `role="admin"`
   - ❌ Rejects users with `add_country` permission but `role="head"`

---

## ✅ SOLUTION

Change all inconsistent routes to use **permission-based authorization** instead of role-based.

### Changes Needed:

**countryRoutes.js** - Import correct middleware and update these lines:
```javascript
// Line 5: Change FROM
const authorize = require("../middlewares/authorizeMiddleware");
// TO
const authorize = require("../middlewares/authorize");

// Line 104: Change FROM
authorize("admin"),
// TO
authorize("add_country"),

// Line 150: Change FROM
authorize("admin"),
// TO
authorize("edit_country"),

// Line 195: Change FROM
authorize("admin"),
// TO
authorize("delete_country"),

// Line 216: Change FROM
authorize("admin"),
// TO
authorize("edit_country"),

// Line 301: Change FROM
authorize("admin"),
// TO
authorize("edit_country"),
```

**cruiseRoutes.js** - Similar changes needed
**flightRoutes.js** - Similar changes needed
**hotelRoutes.js** - Similar changes needed
**carTrip.js** - Similar changes needed
**visaRoutes.js** - Change to use `manage_visa` permission
**eventRouter.js** - Consider adding event management permissions

---

## 📋 Test Your Permissions After Fix

1. Create a test user with role="head" and permissions=["add_program", "add_country"]
2. User should be able to:
   - ✅ Access /Admindashbord/programs page (frontend checks)
   - ✅ Create programs (backend allows add_program permission)
   - ✅ Access /Admindashbord/countries page (frontend checks)
   - ✅ Create countries (backend allows add_country permission)
3. User should NOT be able to:
   - ❌ Access /Admindashbord/dashboard (no admin role check)
   - ❌ Delete programs (no delete_program permission)
   - ❌ Manage visa
