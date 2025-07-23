const User = require('../models/User');
const Course = require('../models/Course');

// Get admin dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    // Get current date and date 30 days ago for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    // Total students count
    const totalStudents = await User.countDocuments({ role: 'student' });
    const newStudentsThisMonth = await User.countDocuments({ 
      role: 'student',
      createdAt: { $gte: firstDayOfMonth }
    });

    // Total courses count (changed from activeCourses to totalCourses)
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isActive: true });

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

    // Messages count (placeholder for now)
    const messages = 0;

    // Create stats object that matches frontend expectations
    const stats = {
      totalStudents,
      totalCourses,      
      totalEnrollments,
      newStudentsThisMonth, 
      publishedCourses,  
      messages
    };

    // Return in the structure your frontend expects
    res.json({
      success: true,
      data: {
        data: {         
          stats           
        }
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

    // Combine and format activities to match frontend expectations
    const activities = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        type: 'registration',
        message: `${user.name} registered as a new student`,
        user: user.name,
        timestamp: user.createdAt
      });
    });

    // Add course creations
    recentCourses.forEach(course => {
      activities.push({
        id: `course_${course._id}`,
        type: 'course_update',
        message: `New course "${course.title}" was created`,
        user: course.createdBy?.name || 'Admin',
        timestamp: course.createdAt
      });
    });

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Return in the structure your frontend expects
    res.json({
      success: true,
      data: {
        data: {
          activities: activities.slice(0, limit)
        }
      }
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