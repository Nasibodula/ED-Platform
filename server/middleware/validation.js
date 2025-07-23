// const { body, param, query } = require('express-validator');

// // User registration validation
// const validateRegister = [
//   body('name')
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Name must be between 2 and 50 characters'),
  
//   body('email')
//     .isEmail()

//     .withMessage('Please provide a valid email address'),
  
//   body('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters long')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//     .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
//   body('role')
//     .optional()
//     .isIn(['student', 'admin'])
//     .withMessage('Role must be either student or admin')
// ];

// // User login validation
// const validateLogin = [
//   body('email')
//     .isEmail()
//     .withMessage('Please provide a valid email address'),
  
//   body('password')
//     .notEmpty()
//     .withMessage('Password is required')
// ];

// // Course creation validation
// const validateCourse = [
//   body('title')
//     .trim()
//     .isLength({ min: 3, max: 100 })
//     .withMessage('Course title must be between 3 and 100 characters'),
  
//   body('description')
//     .trim()
//     .isLength({ min: 10, max: 1000 })
//     .withMessage('Course description must be between 10 and 1000 characters'),
  
//   body('category')
//     .isIn(['Basic Cushite', 'Intermediate Cushite', 'Advanced Cushite', 'Culture', 'Grammar', 'Vocabulary'])
//     .withMessage('Please select a valid category'),
  
//   body('level')
//     .isIn(['Beginner', 'Intermediate', 'Advanced'])
//     .withMessage('Please select a valid level'),
  
//   body('instructor')
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Instructor name must be between 2 and 50 characters'),
  
//   body('price')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Price must be a positive number'),
  
//   body('isPremium')
//     .optional()
//     .isBoolean()
//     .withMessage('isPremium must be a boolean'),
  
//   body('isPublished')
//     .optional()
//     .isBoolean()
//     .withMessage('isPublished must be a boolean'),
  
//   body('tags')
//     .optional()
//     .isArray()
//     .withMessage('Tags must be an array'),
  
//   body('requirements')
//     .optional()
//     .isArray()
//     .withMessage('Requirements must be an array'),
  
//   body('learningObjectives')
//     .optional()
//     .isArray()
//     .withMessage('Learning objectives must be an array')
// ];

// // Profile update validation
// const validateProfileUpdate = [
//   body('name')
//     .optional()
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Name must be between 2 and 50 characters'),
  
//   body('profilePicture')
//     .optional()
//     .isURL()
//     .withMessage('Profile picture must be a valid URL'),
  
//   body('preferences.language')
//     .optional()
//     .isLength({ min: 2, max: 20 })
//     .withMessage('Language preference must be between 2 and 20 characters'),
  
//   body('preferences.notifications')
//     .optional()
//     .isBoolean()
//     .withMessage('Notifications preference must be a boolean'),
  
//   body('preferences.theme')
//     .optional()
//     .isIn(['light', 'dark'])
//     .withMessage('Theme must be either light or dark')
// ];

// // Course progress validation
// const validateCourseProgress = [
//   param('courseId')
//     .isMongoId()
//     .withMessage('Invalid course ID'),
  
//   body('progress')
//     .isInt({ min: 0, max: 100 })
//     .withMessage('Progress must be an integer between 0 and 100')
// ];

// // MongoDB ObjectId validation
// const validateObjectId = (paramName) => [
//   param(paramName)
//     .isMongoId()
//     .withMessage(`Invalid ${paramName}`)
// ];

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

// module.exports = {
//   validateRegister,
//   validateLogin,
//   validateCourse,
//   validateProfileUpdate,
//   validateCourseProgress,
//   validateObjectId,
//   validatePagination
// };


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