const express = require('express');
const { registerStudent, loginUser, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register student
// @access  Public
router.post('/register', registerStudent);

// @route   POST /api/auth/login  
// @desc    Login (both admin and student)
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user (protected route)
// @access  Private
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;