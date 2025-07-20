const express = require('express');
const { registerStudent, loginUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register student
router.post('/register', registerStudent);

// Login (both admin and student)
router.post('/login', loginUser);

// Get current user (protected route)
router.get('/me', protect, getCurrentUser);

module.exports = router;