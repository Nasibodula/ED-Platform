const express = require('express');
const router = express.Router();
const { signup, signin, getProfile, logout } = require('../controllers/authController');
// const authenticateToken = require('../middleware/auth');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

module.exports = router;