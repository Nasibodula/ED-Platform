const express = require('express');
const router = express.Router();
const {
  getEnrolledCourses,
  updateCourseProgress,
  getStudentStats,
  getCourseForStudent
} = require('../controllers/studentController');
const { enrollInCourse } = require('../controllers/courseController');
// const auth = require('../middleware/authMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Student dashboard routes
router.get('/stats', getStudentStats);
router.get('/enrolled-courses', getEnrolledCourses);
router.get('/courses/:courseId', getCourseForStudent);

// Course interaction routes
router.post('/courses/:courseId/enroll', enrollInCourse);
router.put('/courses/:courseId/progress', updateCourseProgress);

module.exports = router;