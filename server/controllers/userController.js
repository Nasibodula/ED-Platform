const User = require('../models/User');
const Course = require('../models/Course');

// Get all students (Admin only)
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = { role: 'student' };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(filter)
      .select('name email createdAt enrolledCourses isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Add enrollment count for each student
    const studentsWithEnrollments = students.map(student => ({
      ...student.toObject(),
      enrollmentCount: student.enrolledCourses?.length || 0
    }));

    res.json({
      success: true,
      data: {
        students: studentsWithEnrollments,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + students.length < total,
          hasPrev: parseInt(page) > 1,
          totalCount: total
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
    const userId = req.userId;
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title description thumbnail');

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
    const userId = req.userId;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.role;
    delete updates.isActive;
    delete updates.enrolledCourses;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

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
    const { progress, lessonId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'User is not enrolled in this course'
      });
    }

    // Update progress
    const currentProgress = user.enrolledCourses[enrollmentIndex].progress;
    user.enrolledCourses[enrollmentIndex].progress = Math.max(currentProgress, progress);
    user.enrolledCourses[enrollmentIndex].lastAccessed = new Date();

    // Mark as completed if progress is 100%
    if (progress >= 100) {
      user.enrolledCourses[enrollmentIndex].isCompleted = true;
      user.enrolledCourses[enrollmentIndex].completedAt = new Date();
    }

    // Add completed lesson if provided
    if (lessonId) {
      const completedLessons = user.enrolledCourses[enrollmentIndex].completedLessons || [];
      const alreadyCompleted = completedLessons.some(
        lesson => lesson.lessonId.toString() === lessonId
      );

      if (!alreadyCompleted) {
        user.enrolledCourses[enrollmentIndex].completedLessons.push({
          lessonId,
          completedAt: new Date()
        });
      }
    }

    await user.save();

    // Also update progress in course model
    await course.updateProgress(userId, progress, lessonId);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: user.enrolledCourses[enrollmentIndex].progress,
        isCompleted: user.enrolledCourses[enrollmentIndex].isCompleted
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