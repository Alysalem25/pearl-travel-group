"use client";

/**
 * Authentication Context
 * Manages global authentication state
 * 
 * Provides:
 * - User state and loading
 * - Login/Register/Logout functions
 * - Automatic token validation
 * - Role-based access checks
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { api } from "@/lib/api";
import {
  getAuthUser,
  saveAuthData,
  clearAuthData,
  isTokenExpired,
  getAuthToken,
  AuthUser,
  AuthResponse
} from "@/lib/auth";

// Context type definition
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string, number: string) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isHead:() => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth state on mount
   * Checks if user is stored in localStorage
   * Validates token expiration
   */
  useEffect(() => {
    const initializeAuth = () => {
      const token = getAuthToken();
      const storedUser = getAuthUser();
      
      console.log("[AuthContext] Initializing auth:", { 
        hasToken: !!token, 
        hasStoredUser: !!storedUser,
        storedUser 
      });
      
      if (token && storedUser) {
        // Check if token has expired
        if (isTokenExpired()) {
          console.log("[AuthContext] Token expired, clearing auth");
          clearAuthData();
          setUser(null);
        } else {
          console.log("[AuthContext] Token valid, restoring user:", storedUser);
          setUser(storedUser);
        }
      } else {
        console.log("[AuthContext] No token or user found");
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.auth.login({ email, password });
      const { token, user: userData } = response.data;
      
      console.log("[AuthContext] Login successful, user data:", userData);
      
      // Save to localStorage
      saveAuthData(token, userData);
      setUser(userData);
      
      console.log("[AuthContext] User saved to context:", userData);

      return { token, user: userData, message: "Login successful" };
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      console.error("[AuthContext] Login error:", message);
      throw new Error(message);
    }
  };

  /**
   * Register function
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    number: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.auth.register({ name, email, password, number });
      const { token, user: userData } = response.data;
      
      console.log("[AuthContext] Register successful, user data:", userData);
      
      // Save to localStorage
      saveAuthData(token, userData);
      setUser(userData);
      
      console.log("[AuthContext] User saved to context:", userData);

      return { token, user: userData, message: "Registration successful" };
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      console.error("[AuthContext] Register error:", message);
      throw new Error(message);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  /**
   * Check user role
   */
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  /**
   * Check if user has specific permission
   */
const hasPermission = (permission: string): boolean => {
  if (!user) {
    alert(`[hasPermission] No user`);
    return false;
  }

  if (user.permissions?.includes("*")) {
    console.log(`[hasPermission] User has wildcard access`, { permission });
    return true;
  }

  const result = user.permissions?.includes(permission) || false;
  console.log(`[hasPermission] ${permission}:`, {
    result,
    userPermissions: user.permissions,
    hasWildcard: user.permissions?.includes("*")
  });
  
  return result;
};

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole("admin");
  };

  const isHead = (): boolean => {
    return hasRole("head");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user && !!getAuthToken(),
        login,
        register,
        logout,
        hasRole,
        hasPermission,
        isAdmin,
        isHead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use Auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
