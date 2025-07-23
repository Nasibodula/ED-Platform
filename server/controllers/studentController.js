const User = require('../models/User');
const Course = require('../models/Course');

// Get enrolled courses for a student
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses.courseId',
        model: 'Course',
        select: 'title description instructor category level thumbnail duration studentsEnrolled'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format the enrolled courses data
    const enrolledCourses = user.enrolledCourses
      .filter(enrollment => enrollment.courseId)
      .map(enrollment => ({
        ...enrollment.toObject(),
        courseId: enrollment.courseId
      }));

    res.json({
      success: true,
      data: {
        courses: enrolledCourses,
        totalEnrolled: enrolledCourses.length
      }
    });

  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update course progress for a student
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, completedLessons } = req.body;
    const userId = req.userId;

    // Validate progress
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the enrolled course
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Course enrollment not found'
      });
    }

    // Update progress
    user.enrolledCourses[enrollmentIndex].progress = progress;
    user.enrolledCourses[enrollmentIndex].lastAccessed = new Date();
    
    if (completedLessons) {
      user.enrolledCourses[enrollmentIndex].completedLessons = completedLessons;
    }

    // Mark as completed if progress is 100%
    if (progress === 100) {
      user.enrolledCourses[enrollmentIndex].completedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress,
        completedAt: user.enrolledCourses[enrollmentIndex].completedAt
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

// Get student dashboard statistics
const getStudentStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId)
      .populate('enrolledCourses.courseId', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const enrolledCourses = user.enrolledCourses || [];
    
    // Calculate statistics
    const enrolledCoursesCount = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
    const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
    
    const totalProgress = enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0);
    const averageProgress = enrolledCoursesCount > 0 ? Math.round(totalProgress / enrolledCoursesCount) : 0;
    
    // Recent activity
    const recentActivity = enrolledCourses
      .filter(course => course.lastAccessed)
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, 5)
      .map(course => ({
        courseTitle: course.courseId?.title || 'Unknown Course',
        progress: course.progress,
        lastAccessed: course.lastAccessed
      }));

    res.json({
      success: true,
      data: {
        stats: {
          enrolledCoursesCount,
          completedCourses,
          inProgressCourses,
          averageProgress
        },
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get course details for student (with enrollment info)
const getCourseForStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(courseId)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(userId);
    const enrollment = user.enrolledCourses.find(
      enroll => enroll.courseId.toString() === courseId
    );

    const courseData = {
      ...course.toObject(),
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    };

    res.json({
      success: true,
      data: { course: courseData }
    });

  } catch (error) {
    console.error('Get course for student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getEnrolledCourses,
  updateCourseProgress,
  getStudentStats,
  getCourseForStudent
};