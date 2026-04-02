/**
 * Authentication & Authorization Utilities
 * 
 * SIMPLIFIED VERSION - Uses the single source of truth from AuthContext
 * 
 * All authorization should go through:
 * 1. useAuth() hook in components
 * 2. hasPermission() for permission checks
 * 3. hasRole() for role checks
 * 
 * NEVER check role before permission!
 * ALWAYS check permission directly with hasPermission()
 */

import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "./permissionConstants";

/**
 * Main hook for all auth checks in components
 * 
 * Usage:
 *   const { hasPermission, user } = useAuthChecks();
 *   
 *   {hasPermission(PERMISSIONS.ADD_PROGRAM) && <Button>Add Program</Button>}
 */
export const useAuthChecks = () => {
  const auth = useAuth();

  return {
    // Expose main functions
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
    isAdmin: () => auth.hasRole("admin"),
    isHead: () => auth.hasRole("head"),
    isManager: () => auth.hasRole("admin") || auth.hasRole("head"),
    
    // User data
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    
    // Shortcuts for common permissions (PERMISSION-BASED ONLY)
    canAddProgram: () => auth.hasPermission(PERMISSIONS.ADD_PROGRAM),
    canEditProgram: () => auth.hasPermission(PERMISSIONS.EDIT_PROGRAM),
    canDeleteProgram: () => auth.hasPermission(PERMISSIONS.DELETE_PROGRAM),

    canAddCountry: () => auth.hasPermission(PERMISSIONS.ADD_COUNTRY),
    canEditCountry: () => auth.hasPermission(PERMISSIONS.EDIT_COUNTRY),
    canDeleteCountry: () => auth.hasPermission(PERMISSIONS.DELETE_COUNTRY),

    canAddCategory: () => auth.hasPermission(PERMISSIONS.ADD_CATEGORY),
    canEditCategory: () => auth.hasPermission(PERMISSIONS.EDIT_CATEGORY),
    canDeleteCategory: () => auth.hasPermission(PERMISSIONS.DELETE_CATEGORY),

    canAddCruise: () => auth.hasPermission(PERMISSIONS.ADD_CRUISE),
    canEditCruise: () => auth.hasPermission(PERMISSIONS.EDIT_CRUISE),
    canDeleteCruise: () => auth.hasPermission(PERMISSIONS.DELETE_CRUISE),

    canManageUsers: () => auth.hasPermission(PERMISSIONS.MANAGE_USERS),
    canManageVisa: () => auth.hasPermission(PERMISSIONS.MANAGE_VISA),

    // Booking management
    canManageBookedFlights: () => auth.hasPermission(PERMISSIONS.MANAGE_BOOKED_FLIGHTS),
    canManageBookedPrograms: () => auth.hasPermission(PERMISSIONS.MANAGE_BOOKED_PROGRAMS),
    canManageBookedTransportation: () => auth.hasPermission(PERMISSIONS.MANAGE_BOOKED_TRANSPORTATION),
    canManageBookedHotels: () => auth.hasPermission(PERMISSIONS.MANAGE_BOOKED_HOTELS),
    canManageBookedCruises: () => auth.hasPermission(PERMISSIONS.MANAGE_BOOKED_CRUISES),
  };
};

/**
 * DEPRECATED: Old authUtils functions
 * 
 * ❌ DO NOT USE - kept for backward compatibility only
 * Use useAuthChecks() hook instead
 */

import type { useAuth as UseAuthType } from "@/context/AuthContext";

// These will throw if used outside components, but should not be used anyway
const throwIfOutsideComponent = () => {
  throw new Error(
    "Auth functions without 'use' prefix are deprecated. Use the useAuthChecks() hook instead.\n\n" +
    "Example:\n" +
    "  const { hasPermission } = useAuthChecks();\n" +
    "  if (hasPermission(PERMISSIONS.ADD_PROGRAM)) { ... }"
  );
};

export const isAdmin = () => throwIfOutsideComponent();
export const isHead = () => throwIfOutsideComponent();
export const isUser = () => throwIfOutsideComponent();

export type UserRole = "admin" | "head" | "user";
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
