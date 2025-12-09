import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI, setAdminToken, clearAdminToken, getAdminToken } from '../services/adminAPI';

/**
 * Admin Context Interface
 * Manages admin authentication state separately from regular users
 */
interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Admin Provider Component
 * Wraps admin routes and provides authentication state
 */
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check if admin is authenticated
   * Called on app load and after login
   */
  const checkAuth = async () => {
    // If no token in memory, not authenticated
    if (!getAdminToken()) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get admin profile with current token
      const response = await adminAuthAPI.getProfile();
      
      if (response.success && response.data) {
        setAdmin(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid or expired
      console.error('Admin auth check failed:', error);
      setAdmin(null);
      setIsAuthenticated(false);
      clearAdminToken();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Call admin login API
      const response = await adminAuthAPI.login({ email, password });
      
      if (response.success && response.data) {
        // Set admin data
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
        
        console.log('✅ Admin logged in:', response.data.admin.email);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      
      // Extract error message
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.';
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Admin logout
   * Clears admin state and tokens
   */
  const logout = async () => {
    try {
      // Call admin logout API to clear refresh token cookie
      await adminAuthAPI.logout();
      
      // Clear state
      setAdmin(null);
      setIsAuthenticated(false);
      clearAdminToken();
      
      console.log('✅ Admin logged out');
    } catch (error) {
      console.error('❌ Admin logout error:', error);
      
      // Clear state anyway
      setAdmin(null);
      setIsAuthenticated(false);
      clearAdminToken();
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AdminContextType = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/**
 * Custom hook to use Admin Context
 * Must be used within AdminProvider
 */
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  
  return context;
};

export default AdminContext;
