import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  Trash2,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';
import { messageAPI } from '../../../utils/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getAllMessages({
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        limit: 50
      });

      if (response.data.success) {
        const messagesData = response.data.data.messages || [];
        
        // Transform messages to match frontend format
        const transformedMessages = messagesData.map(msg => ({
          id: msg._id,
          subject: msg.subject,
          message: msg.message,
          type: msg.type,
          priority: msg.priority,
          status: msg.status,
          isRead: msg.isRead,
          studentName: msg.studentId?.name || 'Unknown Student',
          studentEmail: msg.studentId?.email || 'No email',
          studentAvatar: (msg.studentId?.name || 'U').charAt(0).toUpperCase(),
          adminResponse: msg.adminResponse,
          respondedBy: msg.respondedBy?.name || msg.respondedBy,
          respondedAt: msg.respondedAt,
          createdAt: msg.createdAt,
          requestedCourse: typeof msg.requestedCourse === 'object' 
            ? msg.requestedCourse.title || msg.requestedCourse.name || JSON.stringify(msg.requestedCourse)
            : msg.requestedCourse
        }));

        setMessages(transformedMessages);

        // Calculate stats
        const newStats = {
          total: transformedMessages.length,
          pending: transformedMessages.filter(m => m.status === 'pending').length,
          inProgress: transformedMessages.filter(m => m.status === 'in_progress').length,
          resolved: transformedMessages.filter(m => m.status === 'resolved').length
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [searchTerm, statusFilter, typeFilter, priorityFilter]);

  // Handle message response
  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !selectedMessage) return;

    try {
      setSubmittingResponse(true);
      
      const response = await messageAPI.respondToMessage(
        selectedMessage.id, 
        responseText.trim(),
        'resolved'
      );

      if (response.data.success) {
        // Update local state
        setMessages(prev => prev.map(msg => 
          msg.id === selectedMessage.id 
            ? { 
                ...msg, 
                adminResponse: responseText.trim(),
                respondedBy: 'Admin',
                respondedAt: new Date().toISOString(),
                status: 'resolved',
                isRead: true
              } 
            : msg
        ));

        setShowMessageModal(false);
        setSelectedMessage(null);
        setResponseText('');
        
        // Show success message
        alert('Response sent successfully!');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to send response. Please try again.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      const response = await messageAPI.updateMessageStatus(messageId, newStatus);
      
      if (response.data.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus, isRead: true } : msg
        ));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await messageAPI.deleteMessage(messageId);
      
      if (response.data.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        alert('Message deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  // View message details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    setResponseText('');
    
    // Mark as read if not already
    if (!message.isRead) {
      handleUpdateStatus(message.id, message.status);
    }
  };

  // Utility functions
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      in_progress: <AlertCircle className="w-3 h-3" />,
      resolved: <CheckCircle className="w-3 h-3" />,
      closed: <CheckCircle className="w-3 h-3" />
    };
    return icons[status] || icons.pending;
  };

  const getTypeIcon = (type) => {
    const icons = {
      course_request: <MessageSquare className="w-4 h-4 text-purple-600" />,
      technical: <AlertCircle className="w-4 h-4 text-red-600" />,
      support: <User className="w-4 h-4 text-blue-600" />,
      general: <MessageSquare className="w-4 h-4 text-gray-600" />
    };
    return icons[type] || icons.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages & Support</h2>
          <p className="text-gray-600 mt-1">Manage student inquiries and support requests</p>
        </div>
        
        <button
          onClick={fetchMessages}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="course_request">Course Request</option>
            <option value="support">Support</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
            <p className="text-gray-500">No student messages match your current filters.</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`bg-white rounded-lg border ${!message.isRead ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'} p-6 hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">{message.studentAvatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(message.type)}
                      <h3 className="font-semibold text-gray-900 truncate">{message.subject}</h3>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User className="w-3 h-3" />
                      <span>{message.studentName}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{getTimeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">{message.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                    {getStatusIcon(message.status)}
                    <span>{message.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              {message.adminResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Admin Response</span>
                  </div>
                  <p className="text-sm text-green-800">{message.adminResponse}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                    <span>By: {message.respondedBy}</span>
                    <span>{getTimeAgo(message.respondedAt)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 capitalize">{message.type.replace('_', ' ')}</span>
                  {message.type === 'course_request' && message.requestedCourse && (
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      Course: {typeof message.requestedCourse === 'object' 
                        ? message.requestedCourse.title || message.requestedCourse.name || 'Course Request'
                        : message.requestedCourse}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="View & Respond"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {message.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(message.id, 'in_progress')}
                      className="text-orange-600 hover:text-orange-700 p-1"
                      title="Mark In Progress"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">{selectedMessage.studentAvatar}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h3>
                    <p className="text-sm text-gray-600">from {selectedMessage.studentName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Message Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} priority
                    </span>
                  </div>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Student Message</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Course Request Details */}
                {selectedMessage.type === 'course_request' && selectedMessage.requestedCourse && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-3">Requested Course</h4>
                    {typeof selectedMessage.requestedCourse === 'object' ? (
                      <div className="space-y-2 text-sm">
                        {selectedMessage.requestedCourse.title && (
                          <p><span className="font-medium text-purple-800">Title:</span> {selectedMessage.requestedCourse.title}</p>
                        )}
                        {selectedMessage.requestedCourse.description && (
                          <p><span className="font-medium text-purple-800">Description:</span> {selectedMessage.requestedCourse.description}</p>
                        )}
                        {selectedMessage.requestedCourse.category && (
                          <p><span className="font-medium text-purple-800">Category:</span> {selectedMessage.requestedCourse.category}</p>
                        )}
                        {selectedMessage.requestedCourse.language && (
                          <p><span className="font-medium text-purple-800">Language:</span> {selectedMessage.requestedCourse.language}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-purple-700">{selectedMessage.requestedCourse}</p>
                    )}
                  </div>
                )}

                {/* Existing Response */}
                {selectedMessage.adminResponse && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Previous Response</h4>
                    <p className="text-green-800">{selectedMessage.adminResponse}</p>
                    <div className="mt-2 text-sm text-green-600">
                      Responded by {selectedMessage.respondedBy} on {new Date(selectedMessage.respondedAt).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Response Form */}
                {selectedMessage.status !== 'resolved' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Send Response</h4>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response to the student..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleSubmitResponse}
                        disabled={!responseText.trim() || submittingResponse}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submittingResponse ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Response</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Student Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{selectedMessage.studentName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{selectedMessage.studentEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;