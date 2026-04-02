/**
 * Permission Constants
 * 
 * Single source of truth for all permission strings
 * Use these instead of hard-coding permission strings
 * 
 * Usage:
 *   hasPermission(PERMISSIONS.ADD_PROGRAM)
 *   <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_FLIGHTS} />
 */

export const PERMISSIONS = {
  // Programs
  ADD_PROGRAM: 'add_program',
  EDIT_PROGRAM: 'edit_program',
  DELETE_PROGRAM: 'delete_program',

  // Countries
  ADD_COUNTRY: 'add_country',
  EDIT_COUNTRY: 'edit_country',
  DELETE_COUNTRY: 'delete_country',

  // Categories
  ADD_CATEGORY: 'add_category',
  EDIT_CATEGORY: 'edit_category',
  DELETE_CATEGORY: 'delete_category',

  // Cruises
  ADD_CRUISE: 'add_cruise',
  EDIT_CRUISE: 'edit_cruise',
  DELETE_CRUISE: 'delete_cruise',

  // Users
  MANAGE_USERS: 'manage_users',

  // Visa
  MANAGE_VISA: 'manage_visa',

  // Bookings
  MANAGE_BOOKED_FLIGHTS: 'manage_booked_flights',
  MANAGE_BOOKED_PROGRAMS: 'manage_booked_programs',
  MANAGE_BOOKED_TRANSPORTATION: 'manage_booked_transportation',
  MANAGE_BOOKED_HOTELS: 'manage_booked_hotels',
  MANAGE_BOOKED_CRUISES: 'manage_booked_cruises',

  // Admin override
  FULL_ACCESS: '*'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Permission groups for easier management
 */
export const PERMISSION_GROUPS = {
  PROGRAMS: [
    PERMISSIONS.ADD_PROGRAM,
    PERMISSIONS.EDIT_PROGRAM,
    PERMISSIONS.DELETE_PROGRAM
  ],

  COUNTRIES: [
    PERMISSIONS.ADD_COUNTRY,
    PERMISSIONS.EDIT_COUNTRY,
    PERMISSIONS.DELETE_COUNTRY
  ],

  CATEGORIES: [
    PERMISSIONS.ADD_CATEGORY,
    PERMISSIONS.EDIT_CATEGORY,
    PERMISSIONS.DELETE_CATEGORY
  ],

  CRUISES: [
    PERMISSIONS.ADD_CRUISE,
    PERMISSIONS.EDIT_CRUISE,
    PERMISSIONS.DELETE_CRUISE
  ],

  BOOKINGS: [
    PERMISSIONS.MANAGE_BOOKED_FLIGHTS,
    PERMISSIONS.MANAGE_BOOKED_PROGRAMS,
    PERMISSIONS.MANAGE_BOOKED_TRANSPORTATION,
    PERMISSIONS.MANAGE_BOOKED_HOTELS,
    PERMISSIONS.MANAGE_BOOKED_CRUISES
  ],

  MANAGEMENT: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_VISA
  ]
} as const;
