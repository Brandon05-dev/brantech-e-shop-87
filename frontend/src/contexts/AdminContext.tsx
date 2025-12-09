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
    try {
      console.log('Checking admin authentication...', { hasToken: !!getAdminToken() });
      
      // If no token in memory, try to refresh using the refresh token cookie
      if (!getAdminToken()) {
        console.log('No access token in memory, attempting token refresh...');
        try {
          const refreshResponse = await adminAuthAPI.refreshToken();
          if (refreshResponse.success && refreshResponse.data.accessToken) {
            console.log('✅ Token refreshed successfully');
            // Token is automatically set by adminAuthAPI.refreshToken
            // Now try to get profile
            const profileResponse = await adminAuthAPI.getProfile();
            if (profileResponse.success && profileResponse.data) {
              setAdmin(profileResponse.data);
              setIsAuthenticated(true);
              console.log('✅ Admin authenticated via refresh token');
              return;
            }
          }
        } catch (refreshError) {
          console.log('Token refresh failed, user needs to login');
        }
        
        setIsLoading(false);
        return;
      }

      // If we have a token, try to get admin profile
      const response = await adminAuthAPI.getProfile();
      
      if (response.success && response.data) {
        setAdmin(response.data);
        setIsAuthenticated(true);
        console.log('✅ Admin authenticated with existing token');
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
