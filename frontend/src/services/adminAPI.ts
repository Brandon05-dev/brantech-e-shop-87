import axios from 'axios';

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Admin API Instance
 * Separate axios instance for admin operations with automatic token refresh
 */
const adminAPI = axios.create({
  baseURL: `${API_URL}/admin`,
  withCredentials: true, // Send cookies with requests for refresh token
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store access token in memory (not localStorage for security)
let adminAccessToken = null;

/**
 * Set admin access token
 * Called after login or token refresh
 */
export const setAdminToken = (token) => {
  adminAccessToken = token;
};

/**
 * Get admin access token
 */
export const getAdminToken = () => {
  return adminAccessToken;
};

/**
 * Clear admin access token
 * Called on logout
 */
export const clearAdminToken = () => {
  adminAccessToken = null;
};

/**
 * Request Interceptor
 * Automatically add Authorization header with access token
 */
adminAPI.interceptors.request.use(
  (config) => {
    if (adminAccessToken) {
      config.headers.Authorization = `Bearer ${adminAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle token expiration and auto-refresh
 */
adminAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the access token using refresh token in cookie
        const response = await axios.post(
          `${API_URL}/admin/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        
        // Update token in memory
        setAdminToken(accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminAPI(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid or expired
        // Clear token and redirect to login
        clearAdminToken();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ========================================
 * ADMIN AUTHENTICATION API
 * ========================================
 */

export const adminAuthAPI = {
  /**
   * Admin login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - Returns admin data and access token
   */
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/admin/login`, credentials, {
      withCredentials: true // Save refresh token in HTTP-only cookie
    });
    
    // Store access token in memory
    if (response.data.success && response.data.data.accessToken) {
      setAdminToken(response.data.data.accessToken);
    }
    
    return response.data;
  },

  /**
   * Admin logout
   * Clears refresh token cookie
   */
  logout: async () => {
    const response = await adminAPI.post('/logout');
    clearAdminToken();
    return response.data;
  },

  /**
   * Refresh access token using refresh token cookie
   * @returns {Promise} - Returns new access token
   */
  refreshToken: async () => {
    const response = await axios.post(
      `${API_URL}/admin/refresh-token`,
      {},
      { withCredentials: true }
    );
    
    // Store new access token in memory
    if (response.data.success && response.data.data.accessToken) {
      setAdminToken(response.data.data.accessToken);
    }
    
    return response.data;
  },

  /**
   * Get current admin profile
   */
  getProfile: async () => {
    const response = await adminAPI.get('/me');
    return response.data;
  },

  /**
   * Update admin profile (name, email)
   * @param {Object} data - { name, email }
   */
  updateProfile: async (data) => {
    const response = await adminAPI.put('/profile', data);
    return response.data;
  },

  /**
   * Change admin password
   * @param {Object} data - { currentPassword, newPassword }
   */
  changePassword: async (data) => {
    const response = await adminAPI.put('/profile/password', data);
    return response.data;
  }
};

/**
 * ========================================
 * DASHBOARD API
 * ========================================
 */

export const adminDashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await adminAPI.get('/dashboard');
    return response.data;
  }
};

/**
 * ========================================
 * USER MANAGEMENT API
 * ========================================
 */

export const adminUserAPI = {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - { page, limit, search, role }
   */
  getUsers: async (params = {}) => {
    const response = await adminAPI.get('/users', { params });
    return response.data;
  },

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} role - New role ('customer' or 'admin')
   */
  updateRole: async (userId, role) => {
    const response = await adminAPI.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   */
  deleteUser: async (userId) => {
    const response = await adminAPI.delete(`/users/${userId}`);
    return response.data;
  }
};

/**
 * ========================================
 * PRODUCT MANAGEMENT API
 * ========================================
 */

export const adminProductAPI = {
  /**
   * Get all products with pagination and filters
   * @param {Object} params - { page, limit, search, category, minPrice, maxPrice }
   */
  getProducts: async (params = {}) => {
    const response = await adminAPI.get('/products', { params });
    return response.data;
  },

  /**
   * Get single product
   * @param {string} productId - Product ID
   */
  getProduct: async (productId) => {
    const response = await adminAPI.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Create new product
   * @param {Object} productData - Product details
   */
  createProduct: async (productData) => {
    const response = await adminAPI.post('/products', productData);
    return response.data;
  },

  /**
   * Update product
   * @param {string} productId - Product ID
   * @param {Object} productData - Updated product details
   */
  updateProduct: async (productId, productData) => {
    const response = await adminAPI.put(`/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Delete product
   * @param {string} productId - Product ID
   */
  deleteProduct: async (productId) => {
    const response = await adminAPI.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Bulk update product stock
   * @param {Array} updates - Array of { id, stock }
   */
  bulkUpdateStock: async (updates) => {
    const response = await adminAPI.put('/products/bulk/stock', { updates });
    return response.data;
  }
};

/**
 * ========================================
 * ORDER MANAGEMENT API
 * ========================================
 */

export const adminOrderAPI = {
  /**
   * Get all orders with pagination and filters
   * @param {Object} params - { page, limit, status, search }
   */
  getOrders: async (params = {}) => {
    const response = await adminAPI.get('/orders', { params });
    return response.data;
  },

  /**
   * Get single order
   * @param {string} orderId - Order ID
   */
  getOrder: async (orderId) => {
    const response = await adminAPI.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   */
  updateStatus: async (orderId, status) => {
    const response = await adminAPI.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  /**
   * Update order shipping info
   * @param {string} orderId - Order ID
   * @param {Object} shippingData - { courierService, trackingNumber, estimatedDelivery }
   */
  updateShipping: async (orderId, shippingData) => {
    const response = await adminAPI.put(`/orders/${orderId}/shipping`, shippingData);
    return response.data;
  },

  /**
   * Update payment status
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - { isPaid, paidAt }
   */
  updatePayment: async (orderId, paymentData) => {
    const response = await adminAPI.put(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  },

  /**
   * Delete order
   * @param {string} orderId - Order ID
   */
  deleteOrder: async (orderId) => {
    const response = await adminAPI.delete(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get order statistics
   */
  getStats: async () => {
    const response = await adminAPI.get('/orders/stats');
    return response.data;
  }
};

export default adminAPI;
