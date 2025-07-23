const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['course_request', 'support', 'technical', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  },
  // For course requests specifically
  requestedCourse: {
    title: String,
    description: String,
    category: String,
    language: String
  }
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ studentId: 1, status: 1 });
messageSchema.index({ type: 1, status: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for formatted creation date
messageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Pre-save middleware to update respondedAt when adminResponse is added
messageSchema.pre('save', function(next) {
  if (this.isModified('adminResponse') && this.adminResponse && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
