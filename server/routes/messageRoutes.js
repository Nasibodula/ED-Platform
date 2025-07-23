const express = require('express');
const router = express.Router();
const {
  createMessage,
  getStudentMessages,
  getAllMessages,
  updateMessageStatus,
  respondToMessage
} = require('../controllers/messageController');
const { authenticateToken, requireAdmin, requireStudent } = require('../middleware/authMiddleware');

// Student routes
router.post('/', authenticateToken, requireStudent, createMessage);
router.get('/student', authenticateToken, requireStudent, getStudentMessages);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, getAllMessages);
router.put('/:id/status', authenticateToken, requireAdmin, updateMessageStatus);
router.put('/:id/respond', authenticateToken, requireAdmin, respondToMessage);

module.exports = router;
