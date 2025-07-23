const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid URL'
    }
  },
  duration: {
    type: String, // e.g., "15:30" for 15 minutes 30 seconds
    default: '0:00'
  },
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'video', 'audio', 'document']
    }
  }]
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Basic Cushite', 'Intermediate Cushite', 'Advanced Cushite', 'Culture', 'Grammar', 'Vocabulary', 'Conversation']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  language: {
    type: String,
    enum: ['Oromo', 'Somali', 'Borana', 'Mixed'],
    default: 'Mixed'
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
  },
  lessons: [lessonSchema],
  duration: {
    type: String,
    default: '4 weeks'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  // Student enrollment tracking
  enrolledStudents: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
    completedLessons: [{
      lessonId: mongoose.Schema.Types.ObjectId,
      completedAt: Date
    }],
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }],
  // Course statistics
  totalEnrollments: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ 'enrolledStudents.studentId': 1 });

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

// Virtual for estimated duration in hours
courseSchema.virtual('estimatedHours').get(function() {
  if (!this.lessons.length) return 0;
  
  let totalMinutes = 0;
  this.lessons.forEach(lesson => {
    if (lesson.duration) {
      const [minutes, seconds] = lesson.duration.split(':').map(Number);
      totalMinutes += minutes + (seconds || 0) / 60;
    }
  });
  
  return Math.ceil(totalMinutes / 60);
});

// Pre-save middleware to update totalEnrollments
courseSchema.pre('save', function(next) {
  if (this.isModified('enrolledStudents')) {
    this.totalEnrollments = this.enrolledStudents.length;
  }
  next();
});

// Instance method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
  const isEnrolled = this.enrolledStudents.some(
    enrollment => enrollment.studentId.toString() === studentId.toString()
  );
  
  if (!isEnrolled) {
    this.enrolledStudents.push({
      studentId: studentId,
      enrolledAt: new Date(),
      progress: 0
    });
    this.totalEnrollments = this.enrolledStudents.length;
  }
  
  return this.save();
};

// Instance method to update student progress
courseSchema.methods.updateProgress = function(studentId, progress, lessonId = null) {
  const enrollment = this.enrolledStudents.find(
    enrollment => enrollment.studentId.toString() === studentId.toString()
  );
  
  if (enrollment) {
    enrollment.progress = Math.max(enrollment.progress, progress);
    enrollment.lastAccessed = new Date();
    
    if (lessonId && !enrollment.completedLessons.find(l => l.lessonId.toString() === lessonId.toString())) {
      enrollment.completedLessons.push({
        lessonId: lessonId,
        completedAt: new Date()
      });
    }
  }
  
  return this.save();
};

// Static method to get enrolled courses for a student
courseSchema.statics.getStudentCourses = function(studentId) {
  return this.find({
    'enrolledStudents.studentId': studentId,
    isPublished: true
  }).populate('createdBy', 'name');
};

module.exports = mongoose.model('Course', courseSchema);

