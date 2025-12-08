import api from '../lib/api';

export const authAPI = {
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (userData: any) => {
    const { data } = await api.put('/auth/profile', userData);
    return data;
  }
};

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

  getFeatured: async () => {
    const { data } = await api.get('/products/featured');
    return data;
  },

  getBestsellers: async () => {
    const { data } = await api.get('/products/bestsellers');
    return data;
  }
};

export const orderAPI = {
  createOrder: async (orderData: any) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  getOrders: async (params?: any) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  getUserOrders: async () => {
    const { data } = await api.get('/orders/myorders');
    return data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}`, { status });
    return data;
  }
};

export const reviewAPI = {
  createReview: async (reviewData: any) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  },

  getProductReviews: async (productId: string) => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
  },

  deleteReview: async (id: string) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  }
};

export const paymentAPI = {
  initiateMpesa: async (paymentData: any) => {
    const { data } = await api.post('/payment/mpesa/initiate', paymentData);
    return data;
  },

  createStripeIntent: async (paymentData: any) => {
    const { data } = await api.post('/payment/stripe/create-intent', paymentData);
    return data;
  }
};

export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  }
};
