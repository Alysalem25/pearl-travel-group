"use client";

/**
 * Protected Route Component
 * 
 * Wraps pages that require authentication and/or specific roles
 * 
 * Usage:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * Security:
 * - Server-side validation must still be enforced
 * - This is frontend UX optimization only
 * - Backend ALWAYS enforces authorization
 */

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user" | "head";
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback = null
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🔍 DEBUG LOG
    if (requiredPermission) {
      console.log("[ProtectedRoute] Permission Check:", {
        requiredPermission,
        userPermissions: user?.permissions,
        hasPermissionResult: user ? hasPermission(requiredPermission) : false,
        userId: user?.id,
        userRole: user?.role
      });
    }

    // Wait for auth state to load
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log("[ProtectedRoute] Not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    // ✅ Check permission if required (MAIN FIX: call hasPermission here, not in dependency array)
    if (requiredPermission) {
      const hasRequiredPermission = hasPermission(requiredPermission);
      console.log("[ProtectedRoute] Permission result:", hasRequiredPermission);
      if (!hasRequiredPermission) {
        alert("[ProtectedRoute] No permission, redirecting to /");
        router.push("/");
        return;
      }
    }

    // Authorize by role: allow required role plus admin and head roles
    if (requiredRole) {
      const allowedRoles = [requiredRole, "admin", "head"];
      if (!user || !allowedRoles.includes(user.role || "")) {
        alert("[ProtectedRoute] No required role, redirecting to /");
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, requiredPermission, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback or nothing if not authenticated/authorized
  const isAuthorizedByPermission = requiredPermission ? hasPermission(requiredPermission) : true;
  const isAuthorizedByRole = requiredRole
    ? [requiredRole, "admin", "head"].includes(user?.role || "")
    : true;

  if (!isAuthenticated || !isAuthorizedByPermission || !isAuthorizedByRole) {
    return fallback;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Hook for role-based rendering
 * Usage: {canAccess("admin") && <AdminPanel />}
 */
export function useCanAccess(requiredRole?: string) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return false;
  if (!requiredRole) return true;

  return [requiredRole, "admin", "head"].includes(user?.role || "");
}
