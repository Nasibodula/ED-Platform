const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate token and attach user info
const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token and check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is no longer valid. User not found.' 
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Account has been deactivated.' 
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.userRole = user.role;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication.' 
    });
  }
};

// Require authentication (any role)
const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required.' 
    });
  }
  next();
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Require student role
const requireStudent = (req, res, next) => {
  if (req.userRole !== 'student') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Student privileges required.' 
    });
  }
  next();
};

// Allow admin or specific user (for profile updates, etc.)
const requireOwnerOrAdmin = (req, res, next) => {
  const targetUserId = req.params.userId || req.params.id;
  
  if (req.userRole === 'admin' || req.userId.toString() === targetUserId) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. You can only access your own resources.' 
    });
  }
};

// Legacy function names for compatibility
const protect = authenticateToken;
const adminOnly = requireAdmin;

module.exports = {
  authenticateToken,
  requireAuth,
  requireAdmin,
  requireStudent,
  requireOwnerOrAdmin,
  protect,
  adminOnly
};