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
const { validateMessage, validateMessageResponse, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/messages
// @desc    Create new message/support request (Student only)
// @access  Private/Student
router.post('/', authenticateToken, requireAuth, requireStudent, validateMessage, createMessage);

// @route   GET /api/messages
// @desc    Get all messages (Admin only)
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, validatePagination, getAllMessages);

// @route   GET /api/messages/my
// @desc    Get current student's messages
// @access  Private/Student
router.get('/my', authenticateToken, requireAuth, requireStudent, validatePagination, getStudentMessages);

// @route   GET /api/messages/stats
// @desc    Get message statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticateToken, requireAdmin, getMessageStats);

// @route   PUT /api/messages/:id/status
// @desc    Update message status (Admin only)
// @access  Private/Admin
router.put('/:id/status', authenticateToken, requireAdmin, validateObjectId('id'), updateMessageStatus);

// @route   PUT /api/messages/:id/respond
// @desc    Respond to message (Admin only)
// @access  Private/Admin
router.put('/:id/respond', authenticateToken, requireAdmin, validateObjectId('id'), validateMessageResponse, respondToMessage);

// @route   DELETE /api/messages/:id
// @desc    Delete message (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId('id'), deleteMessage);

module.exports = router;