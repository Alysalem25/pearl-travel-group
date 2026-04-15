# Admin Dashboard & User Management System - Exploration Report

## Executive Summary
The Pearl Travel application has a structured admin dashboard with permission-based access control, user management, and booking tracking for multiple services (programs, flights, hotels, cruises, visas).

---

## 1. ADMIN DASHBOARD LAYOUT

### Main Location
`client/app/Admindashbord/` (note the typo - "Admindashbord" not "Dashboard")

### Dashboard Pages
```
├── page.tsx (Main dashboard with statistics overview)
├── users/
│   ├── page.tsx (User listing & management)
│   └── [id]/ (Individual user details)
├── programs/ (Manage program packages)
├── bookedPrograms/ (View submitted program bookings)
├── flights/ (View flight booking requests)
├── hotel/ (View hotel booking requests)
├── bookedCrusies/ (View cruise booking requests)
├── visa/ (View visa applications)
├── countries/ (Manage destinations)
├── categories/ (Manage tour categories)
├── cruisies/ (Manage cruise packages)
└── transportation/ (View transportation bookings)
```

### Dashboard Home (`page.tsx`)
Displays comprehensive statistics:
- **Total Users**: Count of registered users
- **Active Programs**: Currently active tour packages
- **Categories**: Number of categories
- **Program Distribution**:
  - 🇪🇬 Domestic (Egypt)
  - ✈️ International/Outgoing
- **Visa Applications**: Total, Pending, Reviewed
- **Flights**: Total, Reviewed, Pending
- **Bookings**: Total, Pending, Reviewed

---

## 2. USER MODEL SCHEMA & FIELDS

### File: `server/models/Users.js`

```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, min 8 chars, bcrypt hashed),
  number: String (required, phone number),
  role: String (enum: ["admin", "head", "user"], default: "user"),
  permissions: [String] (array of permission strings),
  clientInfo: {
    nationalId: String,
    passportNumber: String,
    address: String
  },
  images: [String] (array of image file paths),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

### Key Points about User Model:
- ⚠️ **NO `workStatus` field exists** - This field needs to be added if required
- Passwords are hashed with bcrypt (salt: 12) in pre-save hook
- Role is just a label; actual permissions are managed in separate `permissions` array
- `permissions` array contains fine-grained permission strings
- `clientInfo` stores client-specific data (not team member info)

### Default Permissions by Role:
**Admin Role:**
- `add_program`, `edit_program`, `delete_program`
- `add_country`, `edit_country`, `delete_country`
- `add_category`, `edit_category`, `delete_category`
- `add_cruise`, `edit_cruise`, `delete_cruise`
- `manage_users`, `manage_visa`
- `manage_booked_flights`, `manage_booked_programs`
- `manage_booked_transportation`, `manage_booked_hotels`, `manage_booked_cruises`
- `*` (full access)

**Head Role:**
- Same as Admin except excludes `manage_users`

---

## 3. BOOKING MODELS & STATUS TRACKING

### Universal Status Pattern
All booking models use the same status tracking mechanism:
- **Status Field**: `enum: ["pending", "reviewed"]` (default: "pending")
- **Reviewer Tracking**: `reviewedBy` field (ObjectId reference to User)
- **Timestamp**: `reviewedAt` in some models, `timestamps` everywhere

### BookedPrograms Model
```javascript
{
  userEmail: String (required),
  userName: String (required),
  userNumber: String (required),
  program: ObjectId (ref: "Program"),
  message: String (default: "Egypt"),
  status: String ("pending" | "reviewed"),
  reviewedBy: ObjectId (ref: "User", nullable),
  timestamps: { createdAt, updatedAt }
}
```

### BookedCruseies Model
```javascript
{
  userEmail: String (required),
  userName: String (required),
  userNumber: String (required),
  cruisies: ObjectId (ref: "Cruisies"),
  message: String,
  status: String ("pending" | "reviewed"),
  reviewedAt: Date (nullable),
  reviewedBy: ObjectId (ref: "User", nullable),
  timestamps: { createdAt, updatedAt }
}
```

### HotelBooking Model
```javascript
{
  country: String,
  city: String,
  hotelName: String,
  fromDate: Date,
  toDate: Date,
  adults: Number,
  children: Number,
  childrenAges: [Number],
  infants: Number,
  userEmail: String (required),
  userName: String (required),
  userPhone: String (required),
  remarks: String,
  status: String ("pending" | "reviewed"),
  reviewedBy: ObjectId (ref: "User"),
  timestamps: { createdAt, updatedAt }
}
```

### Flights Model
```javascript
{
  userEmail: String (required),
  userName: String (required),
  userNumber: String (required),
  tripType: String (enum: ["round", "oneway", "multi"]),
  
  // For round/oneway:
  from: String,
  to: String,
  date: String,
  returnDate: String (if round trip),
  
  // For multi-city:
  multiCities: [{ from, to, date }],
  
  numOfAdults: Number (required, min: 1),
  numOfChildren: Number (default: 0),
  cabinClass: String (enum: ["economy", "business", "first"]),
  
  status: String ("pending" | "reviewed"),
  reviewedBy: ObjectId (ref: "User"),
  timestamps: { createdAt, updatedAt }
}
```

### Visa Model (Different Status Pattern)
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  destination: String,
  otherCountries: String,
  hasTraveledAbroad: Boolean,
  visitedCountries: String,
  status: String (enum: ['pending', 'under_review', 'approved', 'rejected', 'needs_info']),
  ... other visa fields
}
```

---

## 4. USER DISPLAY & FETCHING IN ADMIN AREA

### Users Listing Page (`client/app/Admindashbord/users/page.tsx`)

**Features:**
- Fetches all users via `GET /auth/users` endpoint
- Displays user list with:
  - User name
  - Email
  - Phone number
  - Role
  - Images
  - Team status
  - Client info (national ID, passport, address)
- Search functionality by user name/email
- Create new user form with:
  - Basic info (name, email, password, phone)
  - Role selection
  - Permissions selection
  - Client info
  - Image upload
- Edit/Update user capability
- Delete user capability

**API Calls:**
```typescript
// Fetch all users
GET /auth/users

// Create user
POST /auth/register (with FormData for images)

// Update user
PUT /users/:id

// Delete user
DELETE /users/:id
```

### User Display in Booking Pages
Each booking page displays user info:
```
User Name: {userName || userEmail}
Contact: {userEmail} • {userNumber}
```

Booking pages show:
- Booked Programs: Program name, booking message
- Flights: From/To airports
- Hotels: Hotel name, dates, guest count
- Cruises: Cruise name, booking message

---

## 5. ADMIN AUTHENTICATION & AUTHORIZATION

### Permission System Architecture
**File**: `client/lib/permissionConstants.ts`

```typescript
PERMISSIONS = {
  // Programs
  ADD_PROGRAM, EDIT_PROGRAM, DELETE_PROGRAM,
  
  // Countries
  ADD_COUNTRY, EDIT_COUNTRY, DELETE_COUNTRY,
  
  // Categories
  ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY,
  
  // Cruises
  ADD_CRUISE, EDIT_CRUISE, DELETE_CRUISE,
  
  // Management
  MANAGE_USERS,
  MANAGE_VISA,
  
  // Bookings
  MANAGE_BOOKED_FLIGHTS,
  MANAGE_BOOKED_PROGRAMS,
  MANAGE_BOOKED_TRANSPORTATION,
  MANAGE_BOOKED_HOTELS,
  MANAGE_BOOKED_CRUISES,
  
  // Admin override
  FULL_ACCESS: '*'
}
```

### Authentication Middleware
**File**: `server/routes/authRoutes.js`

```
POST /auth/register      - Create new user (with FormData for images)
POST /auth/login         - Authenticate user, returns JWT
GET /auth/me             - Get current user info
GET /auth/team           - Get team info
GET /auth/users          - Get all users (requires MANAGE_USERS)
```

### Protected Route Component
**File**: `client/components/ProtectedRoute.tsx`

Wraps admin pages:
```typescript
<ProtectedRoute 
  requiredRole="admin"
  requiredPermission={PERMISSIONS.MANAGE_BOOKED_FLIGHTS}
>
  {/* Page content */}
</ProtectedRoute>
```

### Sidebar Navigation with Permission Guards
**File**: `client/components/adminSidebar.tsx`

Each menu item checks user permissions:
```
Dashboard          - No permission check
Countries          - ADD_COUNTRY
Categories         - ADD_CATEGORY
Programs           - ADD_PROGRAM
Booked Programs    - MANAGE_BOOKED_PROGRAMS
Users              - MANAGE_USERS
Visa Applications  - MANAGE_VISA
Flights            - MANAGE_BOOKED_FLIGHTS
Transportation     - MANAGE_BOOKED_TRANSPORTATION
Hotels             - MANAGE_BOOKED_HOTELS
Cruises            - ADD_CRUISE
Booked Cruises     - MANAGE_BOOKED_CRUISES
```

---

## 6. ADMIN DASHBOARD STATISTICS

### Stats Endpoint: `GET /api/stats`
**File**: `server/index.js` (lines 182-237)

Returns comprehensive dashboard statistics:

```javascript
{
  stats: {
    // Users
    userCount: number,
    
    // Programs
    activePrograms: number,
    totalPrograms: number,
    egyptPrograms: number,
    internationalPrograms: number,
    
    // Categories
    categoriesCount: number,
    
    // Visa
    visaApplications: number,
    visaPending: number,
    visaReviewed: number,
    
    // Flights
    flightCount: number,
    reviewedFlights: number,
    pendingFlights: number,
    
    // Booked Programs
    bookedCount: number,
    pendingBookings: number,
    reviewedBookings: number
  }
}
```

---

## 7. BOOKING MANAGEMENT PAGES

### Booked Programs Page
**File**: `client/app/Admindashbord/bookedPrograms/page.tsx`

**Features:**
- Lists all submitted program bookings
- Shows: User name, email, phone, program name, booking message
- Status indicator (pending = yellow background, reviewed = green background)
- Timestamps (created at, reviewed at)
- Reviewer info (who reviewed and when)
- Actions:
  - Toggle Review Status (pending ↔ reviewed)
  - Delete booking

**API Used:**
```
GET /programs/booked
PUT /programs/booked/:id/status { status: "reviewed" | "pending" }
DELETE /programs/booked/:id
```

### Flights Page
**File**: `client/app/Admindashbord/flights/page.tsx`

**Features:**
- Lists all flight booking requests
- Shows: User info, flight route (from → to)
- Status with reviewer information
- Actions: Review/Unreview, Delete

**API Used:**
```
GET /flights
PUT /flights/:id/status { status }
DELETE /flights/:id
```

### Hotels Page
**File**: `client/app/Admindashbord/hotel/page.tsx`

**Features:**
- Lists hotel booking requests
- Shows: Hotel name, dates (from/to), guest count
- User contact info
- Actions: Review/Unreview, Delete

**API Used:**
```
GET /hotelBooking
PUT /hotelBooking/:id/status { status }
DELETE /hotelBooking/:id
```

### Booked Cruises Page
**File**: `client/app/Admindashbord/bookedCrusies/page.tsx`

**Features:**
- Lists cruise booking requests
- Shows: Cruise name, booking message
- Reviewer tracking (name, timestamp)
- Actions: Review/Unreview, Delete

**API Used:**
```
GET /cruisies/booked
PUT /cruisies/booked/:id/status { status }
DELETE /cruisies/booked/:id
```

---

## KEY FINDINGS SUMMARY

### ✅ What EXISTS:
- ✅ Permission-based authorization system with granular controls
- ✅ Role management (admin, head, user)
- ✅ User creation and management interface
- ✅ Booking status tracking with reviewer tracking
- ✅ Protected admin routes with role/permission guards
- ✅ Dashboard statistics overview
- ✅ Separate management pages for each booking type
- ✅ API endpoints for all CRUD operations on bookings
- ✅ Image upload support for users and products
- ✅ FormData handling for multipart uploads

### ❌ What DOES NOT EXIST:
- ❌ `workStatus` field in User model (needs to be added if required)
- ❌ User filtering by role/status on user listing page
- ❌ Pagination on booking list pages
- ❌ Advanced search/filter on bookings
- ❌ Bulk actions for bookings
- ❌ Booking approval/rejection workflow (only pending/reviewed states)
- ❌ User activity log/audit trail
- ❌ Export functionality

### 📊 Booking Model Relationships:
All booking models follow the same pattern:
```
BookingModel
├── userEmail (String)
├── userName (String)
├── userNumber (String)
├── status: "pending" | "reviewed"
├── reviewedBy: ObjectId → User
└── timestamps: createdAt, updatedAt
```

---

## RECOMMENDATIONS FOR EXTENSION

1. **Add workStatus to User model** if needed for tracking team member status
2. **Implement pagination** on booking pages for large datasets
3. **Add advanced filtering** (by date range, user, status) on booking pages
4. **Create bulk actions** for booking management
5. **Add approval/rejection workflow** separate from just "pending" and "reviewed"
6. **Implement audit logging** for booking changes
7. **Add data export** functionality (CSV/PDF for bookings)
8. **Create booking statistics** by date range and category
