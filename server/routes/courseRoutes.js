// const express = require('express');
// const {
//   getAllCourses,
//   getCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   enrollInCourse,
//   getAdminCourses
// } = require('../controllers/courseController');
// const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/authMiddleware');
// const { validateCourse, validateObjectId, validatePagination } = require('../middleware/validation');

// const router = express.Router();

// // @route   GET /api/courses
// // @desc    Get all published courses (for students)
// // @access  Public
// router.get('/', validatePagination, getAllCourses);

// // @route   GET /api/courses/admin
// // @desc    Get all courses (Admin only)
// // @access  Private/Admin
// router.get('/admin', authenticateToken, requireAdmin, validatePagination, getAdminCourses);

// // @route   GET /api/courses/:id
// // @desc    Get single course
// // @access  Public
// router.get('/:id', validateObjectId('id'), getCourse);

// // @route   POST /api/courses
// // @desc    Create new course (Admin only)
// // @access  Private/Admin
// router.post('/', authenticateToken, requireAdmin, validateCourse, createCourse);

// // @route   PUT /api/courses/:id
// // @desc    Update course (Admin only)
// // @access  Private/Admin
// router.put('/:id', authenticateToken, requireAdmin, validateObjectId('id'), updateCourse);

// // @route   DELETE /api/courses/:id
// // @desc    Delete course (Admin only)
// // @access  Private/Admin
// router.delete('/:id', authenticateToken, requireAdmin, validateObjectId('id'), deleteCourse);

// // @route   POST /api/courses/:id/enroll
// // @desc    Enroll in course
// // @access  Private/Student
// router.post('/:id/enroll', authenticateToken, requireAuth, validateObjectId('id'), enrollInCourse);

// module.exports = router;


const express = require('express');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getAdminCourses
} = require('../controllers/courseController');
const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/authMiddleware');
const { validateCourse, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all published courses (for students)
// @access  Public
router.get('/', validatePagination, getAllCourses);

// @route   GET /api/courses/admin
// @desc    Get all courses (Admin only)
// @access  Private/Admin
router.get('/admin', authenticateToken, requireAdmin, validatePagination, getAdminCourses);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', validateObjectId, getCourse);

// @route   POST /api/courses
// @desc    Create new course (Admin only)
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, validateCourse, createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course (Admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, validateObjectId, updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId, deleteCourse);

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in course
// @access  Private/Student
router.post('/:id/enroll', authenticateToken, requireAuth, validateObjectId, enrollInCourse);

module.exports = router;