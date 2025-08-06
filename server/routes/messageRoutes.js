const express = require('express');
const {
  createMessage,
  getAllMessages,
  getStudentMessages,
  updateMessageStatus,
  respondToMessage,
  deleteMessage,
  getMessageStats
} = require('../controllers/messageController');
const { authenticateToken, requireAdmin, requireAuth, requireStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
// @route   POST /api/messages
// @desc    Create new message/support request (Student only)
// @access  Private/Student
router.post('/', authenticateToken, requireAuth, requireStudent, createMessage);

// @route   GET /api/messages/my
// @desc    Get current student's messages
// @access  Private/Student
router.get('/my', authenticateToken, requireAuth, requireStudent, getStudentMessages);

// LEGACY ROUTE - for backward compatibility
// @route   GET /api/messages/student
// @desc    Get current student's messages (legacy)
// @access  Private/Student
router.get('/student', authenticateToken, requireAuth, requireStudent, getStudentMessages);

// Admin routes
// @route   GET /api/messages
// @desc    Get all messages (Admin only)
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, getAllMessages);

// LEGACY ROUTE - for backward compatibility
// @route   GET /api/messages/admin
// @desc    Get all messages (Admin only) (legacy)
// @access  Private/Admin
router.get('/admin', authenticateToken, requireAdmin, getAllMessages);

// @route   GET /api/messages/stats
// @desc    Get message statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticateToken, requireAdmin, getMessageStats);

// @route   PUT /api/messages/:id/status
// @desc    Update message status (Admin only)
// @access  Private/Admin
router.put('/:id/status', authenticateToken, requireAdmin, updateMessageStatus);

// @route   PUT /api/messages/:id/respond
// @desc    Respond to message (Admin only)
// @access  Private/Admin
router.put('/:id/respond', authenticateToken, requireAdmin, respondToMessage);

// @route   DELETE /api/messages/:id
// @desc    Delete message (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, deleteMessage);

module.exports = router;