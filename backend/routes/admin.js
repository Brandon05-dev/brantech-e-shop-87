import express from 'express';
import {
  adminLogin,
  refreshAdminToken,
  adminLogout,
  getAdminProfile
} from '../controllers/adminAuthController.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/adminDashboardController.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStock
} from '../controllers/adminProductController.js';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderShipping,
  updatePaymentStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/adminOrderController.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

/**
 * ========================================
 * ADMIN AUTHENTICATION ROUTES (PUBLIC)
 * ========================================
 */

// @route   POST /api/admin/login
// @desc    Admin login - separate from regular user login
// @access  Public (but only accepts admin role)
router.post('/login', adminLogin);

// @route   POST /api/admin/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public (requires valid refresh token in cookie)
router.post('/refresh-token', refreshAdminToken);

/**
 * ========================================
 * PROTECTED ADMIN ROUTES
 * All routes below require adminProtect middleware
 * ========================================
 */

// @route   POST /api/admin/logout
// @desc    Admin logout - clears refresh token cookie
// @access  Private (Admin)
router.post('/logout', adminProtect, adminLogout);

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private (Admin)
router.get('/me', adminProtect, getAdminProfile);

/**
 * ========================================
 * DASHBOARD ROUTES
 * ========================================
 */

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminProtect, getDashboardStats);

/**
 * ========================================
 * USER MANAGEMENT ROUTES
 * ========================================
 */

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private (Admin)
router.get('/users', adminProtect, getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (make admin or remove admin)
// @access  Private (Admin)
router.put('/users/:id/role', adminProtect, updateUserRole);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', adminProtect, deleteUser);

/**
 * ========================================
 * PRODUCT MANAGEMENT ROUTES
 * ========================================
 */

// @route   GET /api/admin/products
// @desc    Get all products with pagination and filters
// @access  Private (Admin)
router.get('/products', adminProtect, getAllProducts);

// @route   GET /api/admin/products/:id
// @desc    Get single product by ID
// @access  Private (Admin)
router.get('/products/:id', adminProtect, getProductById);

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private (Admin)
router.post('/products', adminProtect, createProduct);

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/products/:id', adminProtect, updateProduct);

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete('/products/:id', adminProtect, deleteProduct);

// @route   PUT /api/admin/products/bulk/stock
// @desc    Bulk update product stock
// @access  Private (Admin)
router.put('/products/bulk/stock', adminProtect, bulkUpdateStock);

/**
 * ========================================
 * ORDER MANAGEMENT ROUTES
 * ========================================
 */

// @route   GET /api/admin/orders/stats
// @desc    Get order statistics
// @access  Private (Admin)
router.get('/orders/stats', adminProtect, getOrderStats);

// @route   GET /api/admin/orders
// @desc    Get all orders with pagination and filters
// @access  Private (Admin)
router.get('/orders', adminProtect, getAllOrders);

// @route   GET /api/admin/orders/:id
// @desc    Get single order by ID
// @access  Private (Admin)
router.get('/orders/:id', adminProtect, getOrderById);

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:id/status', adminProtect, updateOrderStatus);

// @route   PUT /api/admin/orders/:id/shipping
// @desc    Update order shipping info
// @access  Private (Admin)
router.put('/orders/:id/shipping', adminProtect, updateOrderShipping);

// @route   PUT /api/admin/orders/:id/payment
// @desc    Update payment status
// @access  Private (Admin)
router.put('/orders/:id/payment', adminProtect, updatePaymentStatus);

// @route   DELETE /api/admin/orders/:id
// @desc    Delete order
// @access  Private (Admin)
router.delete('/orders/:id', adminProtect, deleteOrder);

export default router;
