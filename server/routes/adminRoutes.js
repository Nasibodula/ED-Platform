const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getRecentActivities, 
  getAllStudents 
} = require('../controllers/adminController');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCourses
} = require('../controllers/courseController');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Admin authentication middleware
router.use(authenticateToken);
router.use(requireAdmin);


// Dashboard routes
router.get('/stats', getAdminStats);
router.get('/recent-activities', getRecentActivities);
router.get('/students', getAllStudents);

// Course management routes
router.get('/courses', getAdminCourses);
router.get('/courses/:id', getCourse);
router.post('/courses', [
  body('title').trim().isLength({ min: 1 }).withMessage('Course title is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('instructor').trim().isLength({ min: 1 }).withMessage('Instructor name is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level')
], createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);


module.exports = router;