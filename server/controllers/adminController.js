const User = require('../models/User');
const Course = require('../models/Course');

// Get admin dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    // Get current date and date 30 days ago for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total students count
    const totalStudents = await User.countDocuments({ role: 'student' });
    const studentsLastMonth = await User.countDocuments({ 
      role: 'student',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Active courses count
    const activeCourses = await Course.countDocuments({ isActive: true });
    const coursesLastMonth = await Course.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Total enrollments across all courses
    const coursesWithEnrollments = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: '$studentsEnrolled' }
        }
      }
    ]);
    const totalEnrollments = coursesWithEnrollments[0]?.totalEnrollments || 0;

    // Calculate enrollment growth (this is simplified - you might want to track enrollments separately)
    const enrollmentsLastMonth = await Course.aggregate([
      {
        $match: { createdAt: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: null,
          enrollments: { $sum: '$studentsEnrolled' }
        }
      }
    ]);
    const newEnrollments = enrollmentsLastMonth[0]?.enrollments || 0;

    // Messages count (you'll need to implement a Message model)
    const messages = 0; // Placeholder - implement when you add messaging

    // Calculate growth percentages
    const studentsGrowth = totalStudents > 0 
      ? `+${Math.round((studentsLastMonth / Math.max(totalStudents - studentsLastMonth, 1)) * 100)}%`
      : '+0%';
    
    const coursesGrowth = `+${coursesLastMonth}`;
    
    const enrollmentsGrowth = totalEnrollments > 0
      ? `+${Math.round((newEnrollments / Math.max(totalEnrollments - newEnrollments, 1)) * 100)}%`
      : '+0%';

    res.json({
      success: true,
      data: {
        totalStudents,
        activeCourses,
        totalEnrollments,
        messages,
        studentsGrowth,
        coursesGrowth,
        enrollmentsGrowth,
        messagesGrowth: '+0'
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get recent activities for admin dashboard
const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent user registrations
    const recentUsers = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(limit / 2)
      .select('name createdAt');

    // Get recent course creations
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(limit / 2)
      .select('title createdAt createdBy')
      .populate('createdBy', 'name');

    // Combine and format activities
    const activities = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        _id: `user_${user._id}`,
        type: 'enrollment',
        description: `New student registered on the platform`,
        userName: user.name,
        createdAt: user.createdAt
      });
    });

    // Add course creations
    recentCourses.forEach(course => {
      activities.push({
        _id: `course_${course._id}`,
        type: 'course_created',
        description: `New course "${course.title}" was created`,
        userName: course.createdBy?.name || 'Admin',
        createdAt: course.createdAt
      });
    });

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: activities.slice(0, limit)
    });

  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all students (for admin)
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
      .select('name email createdAt enrolledCourses')
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

module.exports = {
  getAdminStats,
  getRecentActivities,
  getAllStudents
};