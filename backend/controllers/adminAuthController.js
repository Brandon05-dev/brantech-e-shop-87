import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT Access Token (short-lived: 15 minutes)
 * Used for authenticating admin API requests
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate JWT Refresh Token (long-lived: 7 days)
 * Used to obtain new access tokens without re-login
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Admin login - separate from regular user login
 * @route   POST /api/admin/login
 * @access  Public (but only accepts admin role)
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      console.log('❌ User is not an admin:', email, 'Role:', user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token as HTTP-only cookie
    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ Admin logged in successfully:', user.email);

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        accessToken,
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

/**
 * @desc    Refresh admin access token using refresh token
 * @route   POST /api/admin/refresh-token
 * @access  Public (requires valid refresh token in cookie)
 */
export const refreshAdminToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Find admin user
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    console.log('🔄 Admin access token refreshed:', user.email);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    
    // Clear invalid refresh token
    res.clearCookie('adminRefreshToken');
    
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      error: error.message
    });
  }
};

/**
 * @desc    Admin logout - clears refresh token cookie
 * @route   POST /api/admin/logout
 * @access  Private (Admin)
 */
export const adminLogout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('adminRefreshToken');

    console.log('👋 Admin logged out:', req.admin.email);

    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully'
    });
  } catch (error) {
    console.error('❌ Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};

/**
 * @desc    Get current admin info
 * @route   GET /api/admin/me
 * @access  Private (Admin)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.admin.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('❌ Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
