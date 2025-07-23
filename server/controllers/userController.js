const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all students (Admin only)
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Build filter
    let filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const students = await User.find(filter)
      .populate('enrolledCourses.courseId', 'title category level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + students.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('enrolledCourses.courseId', 'title description thumbnail category level instructor duration');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, profilePicture, preferences } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update course progress
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const enrolledCourse = user.enrolledCourses.find(
      course => course.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found in enrolled courses'
      });
    }

    enrolledCourse.progress = progress;
    await user.save();

    res.json({
      success: true,
      message: 'Course progress updated successfully',
      data: {
        courseId,
        progress
      }
    });

  } catch (error) {
    console.error('Update course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get dashboard stats (for both admin and student)
const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let stats = {};

    if (user.role === 'admin') {
      const Course = require('../models/Course');
      
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalCourses = await Course.countDocuments();
      const publishedCourses = await Course.countDocuments({ isPublished: true });
      const totalEnrollments = await User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: '$enrolledCourses' },
        { $count: 'total' }
      ]);

      stats = {
        totalStudents,
        totalCourses,
        publishedCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0
      };
    } else {
      const enrolledCoursesCount = user.enrolledCourses.length;
      const completedCourses = user.enrolledCourses.filter(course => course.progress === 100).length;
      const inProgressCourses = user.enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
      const averageProgress = enrolledCoursesCount > 0 
        ? user.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCoursesCount 
        : 0;

      stats = {
        enrolledCoursesCount,
        completedCourses,
        inProgressCourses,
        averageProgress: Math.round(averageProgress)
      };
    }

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deactivate user account (Admin only)
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin account'
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Activate user account (Admin only)
const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: 'User account activated successfully'
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllStudents,
  getUserProfile,
  updateUserProfile,
  updateCourseProgress,
  getDashboardStats,
  deactivateUser,
  activateUser
};