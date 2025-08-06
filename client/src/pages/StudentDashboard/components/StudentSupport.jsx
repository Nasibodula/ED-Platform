import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Book, 
  Settings, 
  HelpCircle, 
  Mail, 
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';
import { messageAPI } from '../../../utils/api';

const StudentSupport = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    type: 'general',
    priority: 'medium',
    requestedCourse: ''
  });

  // Fetch student's messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getStudentMessages({
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
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
          adminResponse: msg.adminResponse,
          respondedBy: msg.respondedBy?.name || msg.respondedBy,
          respondedAt: msg.respondedAt,
          createdAt: msg.createdAt,
          requestedCourse: msg.requestedCourse
        }));

        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // in the case api fails
      setMessages([
        {
          id: 1,
          subject: 'Request for Advanced Oromo Course',
          message: 'I have completed the basic Oromo course and would like to enroll in an advanced level course. Could you please let me know when it will be available?',
          type: 'course_request',
          status: 'pending',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString(), 
          requestedCourse: 'Advanced Oromo Language'
        },
        {
          id: 2,
          subject: 'Technical Issue with Video Player',
          message: 'I am experiencing issues with the video player in the Cultural Studies course. The videos are not loading properly.',
          type: 'technical',
          status: 'resolved',
          priority: 'high',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          adminResponse: 'We have fixed the video player issue. Please try clearing your browser cache and reload the page. If the problem persists, please let us know.',
          respondedBy: 'Tech Support',
          respondedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  // Handle new message submission
  const handleSubmitMessage = async () => {
    if (!newMessage.subject.trim() || !newMessage.message.trim()) {
      alert('Subject and message are required');
      return;
    }

    try {
      setSubmitting(true);
      
      const messageData = {
        subject: newMessage.subject.trim(),
        message: newMessage.message.trim(),
        type: newMessage.type,
        priority: newMessage.priority
      };

      // Add requested course if it's a course request
      if (newMessage.type === 'course_request' && newMessage.requestedCourse.trim()) {
        messageData.requestedCourse = newMessage.requestedCourse.trim();
      }

      const response = await messageAPI.createMessage(messageData);

      if (response.data.success) {
        // Add new message to local state
        const newMsg = {
          id: response.data.data.message._id || Date.now().toString(),
          subject: messageData.subject,
          message: messageData.message,
          type: messageData.type,
          priority: messageData.priority,
          status: 'pending',
          createdAt: new Date().toISOString(),
          requestedCourse: messageData.requestedCourse
        };

        setMessages(prev => [newMsg, ...prev]);
        
        // Reset form
        setNewMessage({
          subject: '',
          message: '',
          type: 'general',
          priority: 'medium',
          requestedCourse: ''
        });
        
        setShowNewMessageModal(false);
        alert('Message sent successfully!');
      }
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-700 bg-blue-100';
      case 'resolved':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course_request':
        return <Book className="w-4 h-4 text-purple-600" />;
      case 'technical':
        return <Settings className="w-4 h-4 text-red-600" />;
      case 'support':
        return <HelpCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Support Center</h2>
            <p className="text-blue-100">
              Get help, request new courses, or provide feedback
            </p>
          </div>
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>My Messages</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'help'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Help & FAQ</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Messages Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Support Messages</h3>
                <button
                  onClick={fetchMessages}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Messages List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-500 mb-4">Start a conversation with our support team</p>
                  <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Send Your First Message
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          {getTypeIcon(message.type)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">{message.subject}</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                                {message.priority} priority
                              </span>
                              <span className="text-sm text-gray-500 capitalize">
                                {message.type.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{message.message}</p>
                            
                            {message.type === 'course_request' && message.requestedCourse && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                                <span className="text-sm font-medium text-purple-900">Requested Course: </span>
                                <span className="text-sm text-purple-700">{message.requestedCourse}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                            {getStatusIcon(message.status)}
                            <span>{message.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Admin Response */}
                      {message.adminResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Support Response</span>
                          </div>
                          <p className="text-sm text-green-800 mb-2">{message.adminResponse}</p>
                          <div className="flex items-center justify-between text-xs text-green-600">
                            <span>Responded by: {message.respondedBy || 'Support Team'}</span>
                            {message.respondedAt && (
                              <span>{getTimeAgo(message.respondedAt)}</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 text-sm text-gray-500">
                        <span>Created: {getTimeAgo(message.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6">
              {/* Quick Help Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">FAQ</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Find answers to common questions</p>
                  <button className="text-blue-600 text-sm hover:text-blue-700 flex items-center space-x-1">
                    <span>Browse FAQ</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Contact us directly via email</p>
                  <a href="mailto:support@cushlearn.com" className="text-green-600 text-sm hover:text-green-700">
                    support@cushlearn.com
                  </a>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
                  <button 
                    onClick={() => setShowNewMessageModal(true)}
                    className="text-purple-600 text-sm hover:text-purple-700"
                  >
                    Start Chat
                  </button>
                </div>
              </div>

              {/* Common Issues */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I access my courses?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Go to the "My Courses" section in your dashboard to access all enrolled courses.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I download certificates?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete all course modules, then find the "Download Certificate" button in your course.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">How do I request a new course?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Use the message system with "Course Request" type to suggest new courses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Send New Message</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter message subject"
                    maxLength={200}
                  />
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newMessage.type}
                      onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="course_request">Course Request</option>
                      <option value="support">Account Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Course Request Field */}
                {newMessage.type === 'course_request' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Course</label>
                    <input
                      type="text"
                      value={newMessage.requestedCourse}
                      onChange={(e) => setNewMessage({ ...newMessage, requestedCourse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the name or topic of the course you'd like to request"
                      maxLength={200}
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message..."
                    maxLength={2000}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {newMessage.message.length}/2000 characters
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitMessage}
                    disabled={!newMessage.subject.trim() || !newMessage.message.trim() || submitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSupport;