// import { useAuth } from "@/context/AuthContext";

// // Types for role and permission checks
// export type UserRole = "admin" | "head" | "user";
// export type Permission =
//     | "add_program" | "edit_program" | "delete_program"
//     | "add_country" | "edit_country" | "delete_country"
//     | "add_category" | "edit_category" | "delete_category"
//     | "manage_users" | "manage_visa"
//     | "manage_booked_flights" | "manage_booked_programs"
//     | "manage_booked_transportation" | "manage_booked_hotels" | "manage_booked_cruises";

// /**
//  * Check if current user has a specific role
//  * NOTE: Only works within React components
//  */
// export const checkRole = (role: UserRole): boolean => {
//     // This will throw an error if used outside a component
//     // Use useAuthCheck hook instead for component usage
//     const auth = useAuth();
//     return auth.hasRole(role);
// };

// /**
//  * Check if current user has a specific permission
//  * NOTE: Only works within React components
//  */
// export const checkPermission = (permission: Permission): boolean => {
//     const auth = useAuth();
//     return auth.hasPermission(permission);
// };

// /**
//  * Check if user is admin
//  * NOTE: Only works within React components
//  */
// export const isAdmin = (): boolean => {
//     return checkRole("admin");
// };

// /**
//  * Check if user is head
//  * NOTE: Only works within React components
//  */
// export const isHead = (): boolean => {
//     return checkRole("head");
// };

// /**
//  * Check if user is regular user
//  * NOTE: Only works within React components
//  */
// export const isUser = (): boolean => {
//     return checkRole("user");
// };

// /**
//  * Check if user has admin or head role (management access)
//  * NOTE: Only works within React components
//  */
// export const isManager = (): boolean => {
//     return checkRole("admin") || checkRole("head");
// };

// /**
//  * Check if user can manage programs
//  * NOTE: Only works within React components
//  */
// export const canAddPrograms = (): boolean => {
//     return isManager() || checkPermission("add_program");
// };
// export const canEditPrograms = (): boolean => {
//     return isManager() || checkPermission("edit_program");
// };
// export const canDeletePrograms = (): boolean => {
//     return isManager() || checkPermission("delete_program");
// };

// // check if user can manage countries
// export const canAddCountries = (): boolean => {
//     return isManager() || checkPermission("add_country");
// };

// export const canEditCountries = (): boolean => {
//     return isManager() || checkPermission("edit_country");
// }

// export const canDeleteCountries = (): boolean => {
//     return isManager() || checkPermission("delete_country");
// }

// // check if can manage categories
// export const canAddCategories = (): boolean => {
//     return isManager() || checkPermission("add_category");
// };

// export const canEditCategories = (): boolean => {
//     return isManager() || checkPermission("edit_category");
// };

// export const canDeleteCategories = (): boolean => {
//     return isManager() || checkPermission("delete_category");
// };

// /**
//  * Check if user can manage users
//  * NOTE: Only works within React components
//  */
// export const canManageUsers = (): boolean => {
//     return isAdmin() || (isHead() && checkPermission("manage_users"));
// };

// /**
//  * Check if user can manage visa applications
//  * NOTE: Only works within React components
//  */
// export const canManageVisa = (): boolean => {
//     return isAdmin() || (isHead() && checkPermission("manage_visa"));
// };

// /**
//  * Check if user can manage bookings
//  * NOTE: Only works within React components
//  */
// export const canManageFlightsBookings = (): boolean => {
//     return isAdmin() || (isHead() && (
//         checkPermission("manage_booked_flights")
//     ));
// };


// export const canManageProgramBookings = (): boolean => {
//     return isAdmin() || (isHead() && (
//         checkPermission("manage_booked_programs")
//     ));
// };

// export const canManageTransportationBookings = (): boolean => {
//     return isAdmin() || (isHead() && (
//         checkPermission("manage_booked_transportation")
//     ));
// };

// export const canManageHotelBookings = (): boolean => {
//     return isAdmin() || (isHead() && (
//         checkPermission("manage_booked_hotels")
//     ));
// };

// export const canManageCruiseBookings = (): boolean => {
//     return isAdmin() || (isHead() && (
//         checkPermission("manage_booked_cruises")
//     ));
// };

// /**
//  * Main authentication check function
//  * Usage: authCheck('admin') or authCheck('manage_users')
//  * NOTE: Only works within React components
//  */
// export const authCheck = (requirement: UserRole | Permission): boolean => {
//     // Check if it's a role
//     if (requirement === "admin" || requirement === "head" || requirement === "user") {
//         return checkRole(requirement);
//     }

//     // Check if it's a permission
//     return checkPermission(requirement as Permission);
// };

// /**
//  * Hook-based versions for use in components
//  */
// export const useAuthCheck = () => {
//     const auth = useAuth();

//     return {
//         // Role checks
//         isAdmin: () => auth.hasRole("admin"),
//         isHead: () => auth.hasRole("head"),
//         isUser: () => auth.hasRole("user"),
//         isManager: () => auth.hasRole("admin") || auth.hasRole("head"),

//         // Permission checks
//         hasPermission: (permission: Permission) => auth.hasPermission(permission),

//         // Specific capability checks
//         canAddPrograms: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("add_program"),
//         canEditPrograms: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("edit_program"),
//         canDeletePrograms: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("delete_program"),
//         canManageUsers: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_users")),
//         canManageVisa: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_visa")),
//         canManageFlightsBookings: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_booked_flights")),
//         canManageProgramBookings: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_booked_programs")),
//         canManageTransportationBookings: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_booked_transportation")),
//         canManageHotelBookings: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_booked_hotels")),
//         canManageCruiseBookings: () => auth.hasRole("admin") || (auth.hasRole("head") && auth.hasPermission("manage_booked_cruises")),
//         canAddCountries: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("add_country"),
//         canEditCountries: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("edit_country"),
//         canDeleteCountries: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("delete_country"),
//         canAddCategories: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("add_category"),
//         canEditCategories: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("edit_category"),
//         canDeleteCategories: () => auth.hasRole("admin") || auth.hasRole("head") || auth.hasPermission("delete_category"),


//         // Generic check
//         check: (requirement: UserRole | Permission) => {
//             if (requirement === "admin" || requirement === "head" || requirement === "user") {
//                 return auth.hasRole(requirement);
//             }
//             return auth.hasPermission(requirement as Permission);
//         }
//     };
// };