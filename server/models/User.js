const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Profile information
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  // User preferences
  preferences: {
    language: {
      type: String,
      enum: ['English', 'Oromo', 'Somali', 'Borana'],
      default: 'English'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  // For students - course enrollment tracking
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    }
  }],
  // Learning statistics
  learningStats: {
    totalCoursesEnrolled: {
      type: Number,
      default: 0
    },
    totalCoursesCompleted: {
      type: Number,
      default: 0
    },
    totalHoursLearned: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date,
      default: Date.now
    }
  },
  // Account verification and security
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'enrolledCourses.courseId': 1 });

// Virtual for full profile completion percentage
userSchema.virtual('profileCompleteness').get(function() {
  let completeness = 0;
  const fields = ['name', 'email', 'bio', 'country', 'phoneNumber', 'profilePicture'];
  
  fields.forEach(field => {
    if (this[field]) completeness += 16.67;
  });
  
  return Math.round(completeness);
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update learning stats when enrolledCourses changes
userSchema.pre('save', function(next) {
  if (this.isModified('enrolledCourses')) {
    this.learningStats.totalCoursesEnrolled = this.enrolledCourses.length;
    this.learningStats.totalCoursesCompleted = this.enrolledCourses.filter(course => course.isCompleted).length;
  }
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to enroll in a course
userSchema.methods.enrollInCourse = function(courseId) {
  const isEnrolled = this.enrolledCourses.some(
    course => course.courseId.toString() === courseId.toString()
  );
  
  if (!isEnrolled) {
    this.enrolledCourses.push({
      courseId: courseId,
      enrolledAt: new Date(),
      lastAccessed: new Date()
    });
    this.learningStats.totalCoursesEnrolled = this.enrolledCourses.length;
  }
  
  return this.save();
};

// Instance method to update course progress
userSchema.methods.updateCourseProgress = function(courseId, progress) {
  const courseIndex = this.enrolledCourses.findIndex(
    course => course.courseId.toString() === courseId.toString()
  );
  
  if (courseIndex !== -1) {
    this.enrolledCourses[courseIndex].progress = Math.max(
      this.enrolledCourses[courseIndex].progress, 
      progress
    );
    this.enrolledCourses[courseIndex].lastAccessed = new Date();
    this.learningStats.lastActivityDate = new Date();
    
    // Mark as completed if progress is 100%
    if (progress >= 100 && !this.enrolledCourses[courseIndex].isCompleted) {
      this.enrolledCourses[courseIndex].isCompleted = true;
      this.enrolledCourses[courseIndex].completedAt = new Date();
      this.learningStats.totalCoursesCompleted = this.enrolledCourses.filter(c => c.isCompleted).length;
    }
  }
  
  return this.save();
};

// Instance method to get dashboard stats
userSchema.methods.getDashboardStats = function() {
  const enrolledCount = this.enrolledCourses.length;
  const completedCount = this.enrolledCourses.filter(course => course.isCompleted).length;
  const inProgressCount = this.enrolledCourses.filter(
    course => course.progress > 0 && course.progress < 100
  ).length;
  const averageProgress = enrolledCount > 0 
    ? Math.round(this.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCount)
    : 0;

  return {
    enrolledCourses: enrolledCount,
    completedCourses: completedCount,
    inProgressCourses: inProgressCount,
    averageProgress,
    totalHoursLearned: this.learningStats.totalHoursLearned,
    currentStreak: this.learningStats.currentStreak,
    profileCompleteness: this.profileCompleteness
  };
};

// Remove sensitive information from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  return userObject;
};

// Static method to get admin dashboard stats
userSchema.statics.getAdminStats = async function() {
  const totalStudents = await this.countDocuments({ role: 'student' });
  const activeStudents = await this.countDocuments({ role: 'student', isActive: true });
  const newStudentsThisMonth = await this.countDocuments({
    role: 'student',
    createdAt: { $gte: new Date(new Date().setDate(1)) }
  });

  return {
    totalStudents,
    activeStudents,
    inactiveStudents: totalStudents - activeStudents,
    newStudentsThisMonth
  };
};

module.exports = mongoose.model('User', userSchema);