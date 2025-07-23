const Message = require('../models/Message');
const { validationResult } = require('express-validator');

// Helper function to calculate time ago
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

// Create new message/support request (Student only)
const createMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { subject, message, type, priority, requestedCourse } = req.body;

    const newMessage = new Message({
      studentId: req.userId,
      subject,
      message,
      type: type || 'general',
      priority: priority || 'medium',
      requestedCourse: type === 'course_request' ? requestedCourse : undefined
    });

    await newMessage.save();
    await newMessage.populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully',
      data: { message: newMessage }
    });

  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all messages (Admin only)
const getAllMessages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get messages with student details
    const messages = await Message.find(filter)
      .populate('studentId', 'name email profilePicture')
      .populate('respondedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Message.countDocuments(filter);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + messages.length < total,
          hasPrev: parseInt(page) > 1,
          totalItems: total
        }
      }
    });

  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current student's messages
const getStudentMessages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object for current student
    let filter = { studentId: req.userId };
    
    // Apply additional filters
    if (status && ['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      filter.status = status;
    }
    
    if (type && ['course_request', 'technical', 'support', 'general'].includes(type)) {
      filter.type = type;
    }
    
    if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
      filter.priority = priority;
    }
    
    // Add search functionality
    if (search && search.trim()) {
      filter.$or = [
        { subject: { $regex: search.trim(), $options: 'i' } },
        { message: { $regex: search.trim(), $options: 'i' } },
        { adminResponse: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Validate and set pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const validSortFields = ['createdAt', 'subject', 'status', 'priority', 'respondedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // Get student's messages with populated admin response info
    const messages = await Message.find(filter)
      .populate('respondedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance since we're not modifying

    // Get total count for pagination
    const total = await Message.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    // Get summary statistics for the student
    const studentStats = await Message.aggregate([
      { $match: { studentId: req.userId } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressCount: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          resolvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          courseRequestCount: {
            $sum: { $cond: [{ $eq: ['$type', 'course_request'] }, 1, 0] }
          },
          technicalCount: {
            $sum: { $cond: [{ $eq: ['$type', 'technical'] }, 1, 0] }
          },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          averageResponseTime: {
            $avg: {
              $cond: [
                { $and: [
                  { $ne: ['$respondedAt', null] },
                  { $ne: ['$createdAt', null] }
                ]},
                { $divide: [
                  { $subtract: ['$respondedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24 // Convert to days
                ]},
                null
              ]
            }
          }
        }
      }
    ]);

    // Format messages with additional computed fields
    const formattedMessages = messages.map(message => ({
      ...message,
      timeAgo: getTimeAgo(message.createdAt),
      hasResponse: Boolean(message.adminResponse),
      responseTime: message.respondedAt ? 
        Math.round((new Date(message.respondedAt) - new Date(message.createdAt)) / (1000 * 60 * 60 * 24)) 
        : null, // Response time in days
      canEdit: message.status === 'pending' && !message.adminResponse,
      formattedCreatedAt: new Date(message.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    const stats = studentStats[0] || {
      totalMessages: 0,
      pendingCount: 0,
      inProgressCount: 0,
      resolvedCount: 0,
      courseRequestCount: 0,
      technicalCount: 0,
      unreadCount: 0,
      averageResponseTime: 0
    };

    res.json({
      success: true,
      data: {
        messages: formattedMessages,
        pagination: {
          current: pageNum,
          total: totalPages,
          hasNext,
          hasPrev,
          totalItems: total,
          itemsPerPage: limitNum,
          showing: {
            from: total === 0 ? 0 : skip + 1,
            to: Math.min(skip + limitNum, total),
            of: total
          }
        },
        filters: {
          applied: {
            status: status || null,
            type: type || null,
            priority: priority || null,
            search: search || null
          },
          available: {
            status: ['pending', 'in_progress', 'resolved', 'closed'],
            type: ['course_request', 'technical', 'support', 'general'],
            priority: ['low', 'medium', 'high', 'urgent']
          }
        },
        stats: {
          ...stats,
          averageResponseTime: Math.round((stats.averageResponseTime || 0) * 10) / 10 // Round to 1 decimal
        }
      }
    });

  } catch (error) {
    console.error('Get student messages error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching your messages',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// Update message status (Admin only)
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;
    message.isRead = true;
    
    await message.save();
    await message.populate('studentId', 'name email');

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: { message }
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Respond to message (Admin only)
const respondToMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { adminResponse, status } = req.body;

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.adminResponse = adminResponse;
    message.respondedBy = req.userId;
    message.respondedAt = new Date();
    message.status = status || 'resolved';
    message.isRead = true;
    
    await message.save();
    await message.populate(['studentId', 'respondedBy'], 'name email');

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: { message }
    });

  } catch (error) {
    console.error('Respond to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete message (Admin only)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get message statistics (Admin only)
const getMessageStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const pendingMessages = await Message.countDocuments({ status: 'pending' });
    const inProgressMessages = await Message.countDocuments({ status: 'in_progress' });
    const resolvedMessages = await Message.countDocuments({ status: 'resolved' });
    const courseRequests = await Message.countDocuments({ type: 'course_request' });
    const technicalIssues = await Message.countDocuments({ type: 'technical' });
    const supportRequests = await Message.countDocuments({ type: 'support' });
    const generalMessages = await Message.countDocuments({ type: 'general' });
    
    // Messages by type
    const messagesByType = await Message.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Messages by status
    const messagesByStatus = await Message.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Messages by priority
    const messagesByPriority = await Message.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Average response time (for resolved messages)
    const responseTimeStats = await Message.aggregate([
      {
        $match: {
          status: 'resolved',
          respondedAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$respondedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageResponseTime: { $avg: '$responseTime' },
          totalResponses: { $sum: 1 }
        }
      }
    ]);

    // Get urgent messages count
    const urgentMessages = await Message.countDocuments({ 
      priority: 'urgent',
      status: { $in: ['pending', 'in_progress'] }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalMessages,
          pendingMessages,
          inProgressMessages,
          resolvedMessages,
          courseRequests,
          technicalIssues,
          supportRequests,
          generalMessages,
          recentMessages,
          urgentMessages
        },
        breakdown: {
          byType: messagesByType,
          byStatus: messagesByStatus,
          byPriority: messagesByPriority
        },
        performance: {
          averageResponseTime: responseTimeStats[0]?.averageResponseTime || 0,
          totalResponses: responseTimeStats[0]?.totalResponses || 0
        }
      }
    });

  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get message by ID (Admin only)
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('studentId', 'name email profilePicture country phone')
      .populate('respondedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }

    res.json({
      success: true,
      data: { message }
    });

  } catch (error) {
    console.error('Get message by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Bulk update messages (Admin only)
const bulkUpdateMessages = async (req, res) => {
  try {
    const { messageIds, action, value } = req.body;

    // Validate input
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message IDs provided'
      });
    }

    let updateOperation = {};
    let successMessage = '';
    
    switch (action) {
      case 'status':
        if (!['pending', 'in_progress', 'resolved', 'closed'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid status value'
          });
        }
        updateOperation.status = value;
        updateOperation.isRead = true;
        successMessage = `Status updated to "${value}" for selected messages`;
        break;
      
      case 'priority':
        if (!['low', 'medium', 'high', 'urgent'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid priority value'
          });
        }
        updateOperation.priority = value;
        successMessage = `Priority updated to "${value}" for selected messages`;
        break;
      
      case 'delete':
        const deleteResult = await Message.deleteMany({ _id: { $in: messageIds } });
        return res.json({
          success: true,
          message: `${deleteResult.deletedCount} messages deleted successfully`,
          data: { 
            deletedCount: deleteResult.deletedCount
          }
        });
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action specified'
        });
    }

    // Perform the update operation
    const result = await Message.updateMany(
      { _id: { $in: messageIds } },
      updateOperation
    );

    res.json({
      success: true,
      message: successMessage,
      data: { 
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Bulk update messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getStudentMessages,
  updateMessageStatus,
  respondToMessage,
  deleteMessage,
  getMessageStats,
  getMessageById,
  bulkUpdateMessages
};