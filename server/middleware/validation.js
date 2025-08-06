const mongoose = require('mongoose');
const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (field = 'id') => [
  param(field).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${field} format`);
    }
    return true;
  }),
  handleValidationErrors
];

// Validate pagination parameters
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Validate profile update data
const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('country').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('phoneNumber').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date'),
  body('preferences.language').optional().isIn(['English', 'Oromo', 'Somali', 'Borana']).withMessage('Invalid language selection'),
  body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Invalid theme selection'),
  handleValidationErrors
];

// Validate course progress update
const validateCourseProgress = [
  body('progress').isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('completedLessons').optional().isArray().withMessage('Completed lessons must be an array'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive integer'),
  handleValidationErrors
];

// Validate course creation/update
const validateCourse = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('instructor').trim().isLength({ min: 1, max: 100 }).withMessage('Instructor name is required and must be less than 100 characters'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Level must be Beginner, Intermediate, or Advanced'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('maxStudents').optional().isInt({ min: 1 }).withMessage('Max students must be a positive integer'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('learningObjectives').optional().isArray().withMessage('Learning objectives must be an array'),
  handleValidationErrors
];

// Validate message creation
const validateMessage = [
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required and must be less than 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  body('type').optional().isIn(['course_request', 'support', 'technical', 'general']).withMessage('Invalid message type'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  body('requestedCourse').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Requested course name must be less than 200 characters'),
  handleValidationErrors
];

//Validate message response
const validateMessageResponse = [
  body('adminResponse').trim().isLength({ min: 1, max: 2000 }).withMessage('Admin response is required and must be less than 2000 characters'),
  body('status').optional().isIn(['pending', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status value'),
  handleValidationErrors
];

// Validate user registration
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'admin']).withMessage('Invalid role'),
  handleValidationErrors
];

// Validate login
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateObjectId,
  validatePagination,
  validateProfileUpdate,
  validateCourseProgress,
  validateCourse,
  validateMessage,
  validateMessageResponse, 
  validateRegistration,
  validateLogin
};