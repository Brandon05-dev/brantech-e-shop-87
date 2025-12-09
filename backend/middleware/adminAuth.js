import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Admin Authentication Middleware
 * Protects admin routes by validating JWT access token and admin role
 * Usage: Apply to admin routes that require authentication
 */
export const adminProtect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token found
    if (!token) {
      console.log('❌ No admin token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's an access token
      if (decoded.type !== 'access') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      // Find user by ID
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('❌ Admin user not found for token');
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
      }

      // Verify user has admin role
      if (user.role !== 'admin') {
        console.log('❌ User is not an admin:', user.email, 'Role:', user.role);
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      // Attach admin user to request object
      req.admin = user;
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      
      // Token expired or invalid
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.message
      });
    }
  } catch (error) {
    console.error('❌ Admin protection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

/**
 * Optional: Additional role-based permission middleware
 * Can be used to further restrict certain admin operations
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
