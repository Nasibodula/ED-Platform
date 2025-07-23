// const { body, query, param } = require('express-validator');

// // Pagination validation
// const validatePagination = [
//   query('page')
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage('Page must be a positive integer'),
  
//   query('limit')
//     .optional()
//     .isInt({ min: 1, max: 50 })
//     .withMessage('Limit must be between 1 and 50'),
  
//   query('search')
//     .optional()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage('Search query cannot exceed 100 characters')
// ];

// // Message creation validation
// const validateMessage = [
//   body('subject')
//     .trim()
//     .isLength({ min: 3, max: 200 })
//     .withMessage('Subject must be between 3 and 200 characters'),
  
//   body('message')
//     .trim()
//     .isLength({ min: 10, max: 2000 })
//     .withMessage('Message must be between 10 and 2000 characters'),
  
//   body('type')
//     .optional()
//     .isIn(['course_request', 'support', 'technical', 'general'])
//     .withMessage('Type must be one of: course_request, support, technical, general'),
  
//   body('priority')
//     .optional()
//     .isIn(['low', 'medium', 'high', 'urgent'])
//     .withMessage('Priority must be one of: low, medium, high, urgent'),
  
//   body('requestedCourse.title')
//     .optional()
//     .trim()
//     .isLength({ min: 3, max: 100 })
//     .withMessage('Course title must be between 3 and 100 characters'),
  
//   body('requestedCourse.description')
//     .optional()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage('Course description cannot exceed 500 characters')
// ];

// // Message response validation
// const validateMessageResponse = [
//   body('adminResponse')
//     .trim()
//     .isLength({ min: 1, max: 2000 })
//     .withMessage('Admin response must be between 1 and 2000 characters'),
  
//   body('status')
//     .optional()
//     .isIn(['pending', 'in_progress', 'resolved', 'closed'])
//     .withMessage('Status must be one of: pending, in_progress, resolved, closed')
// ];

// module.exports = {
//   validateRegister,
//   validateLogin,
//   validateCourse,
//   validateProfileUpdate,
//   validateCourseProgress,
//   validateObjectId,
//   validatePagination,
//   validateMessage,
//   validateMessageResponse
// };


const { body, query, param } = require('express-validator');

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters')
];

// Message creation validation
const validateMessage = [
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  
  body('type')
    .optional()
    .isIn(['course_request', 'support', 'technical', 'general'])
    .withMessage('Type must be one of: course_request, support, technical, general'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  body('requestedCourse.title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Course title must be between 3 and 100 characters'),
  
  body('requestedCourse.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Course description cannot exceed 500 characters')
];

// Message response validation
const validateMessageResponse = [
  body('adminResponse')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Admin response must be between 1 and 2000 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: pending, in_progress, resolved, closed')
];

// You'll also need to define the other validation functions that are being exported
// Add these if they don't exist elsewhere in your file:

const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateCourse = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Course title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Course description must be between 10 and 1000 characters')
];

const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const validateCourseProgress = [
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100')
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateProfileUpdate,
  validateCourseProgress,
  validateObjectId,
  validatePagination,
  validateMessage,
  validateMessageResponse
};