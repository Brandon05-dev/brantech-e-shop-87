import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register', userData);
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', credentials);
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (userData: any) => {
    const { data } = await api.put('/auth/profile', userData);
    if (data.success && data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },
};

// Product API
export const productAPI = {
  getProducts: async (params?: any) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getProduct: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  createProduct: async (productData: any) => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  updateProduct: async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

// Order API
export const orderAPI = {
  getOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  trackOrder: async (orderNumber: string) => {
    const { data } = await api.get(`/orders/track/${orderNumber}`);
    return data;
  },

  createOrder: async (orderData: any) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
};

// User API
export const userAPI = {
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  getUser: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  updateUser: async (id: string, userData: any) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

// Review API
export const reviewAPI = {
  getReviews: async (productId: string) => {
    const { data } = await api.get(`/reviews/${productId}`);
    return data;
  },

  createReview: async (reviewData: any) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  },

  updateReview: async (id: string, reviewData: any) => {
    const { data } = await api.put(`/reviews/${id}`, reviewData);
    return data;
  },

  deleteReview: async (id: string) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  },
};

export default api;
