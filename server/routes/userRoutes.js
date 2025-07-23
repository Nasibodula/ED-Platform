const express = require('express');
const {
  getAllStudents,
  getUserProfile,
  updateUserProfile,
  updateCourseProgress,
  getDashboardStats,
  deactivateUser,
  activateUser
} = require('../controllers/userController');
const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/authMiddleware');
const { validateProfileUpdate, validateCourseProgress, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/students
// @desc    Get all students (Admin only)
// @access  Private/Admin
router.get('/students', authenticateToken, requireAdmin, validatePagination, getAllStudents);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, requireAuth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, requireAuth, validateProfileUpdate, updateUserProfile);

// @route   PUT /api/users/progress/:courseId
// @desc    Update course progress
// @access  Private/Student
router.put('/progress/:courseId', authenticateToken, requireAuth, validateCourseProgress, updateCourseProgress);

// @route   GET /api/users/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard/stats', authenticateToken, requireAuth, getDashboardStats);

// @route   PUT /api/users/:userId/deactivate
// @desc    Deactivate user account (Admin only)
// @access  Private/Admin
router.put('/:userId/deactivate', authenticateToken, requireAdmin, validateObjectId('userId'), deactivateUser);

// @route   PUT /api/users/:userId/activate
// @desc    Activate user account (Admin only)
// @access  Private/Admin
router.put('/:userId/activate', authenticateToken, requireAdmin, validateObjectId('userId'), activateUser);

module.exports = router;
