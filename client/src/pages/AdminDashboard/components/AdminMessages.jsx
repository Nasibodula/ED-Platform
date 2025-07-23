import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Settings,
  HelpCircle,
  Send,
  Eye,
  Trash2,
  ArrowRight,
  User,
  Calendar
} from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, filterStatus, filterType, messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMessages = [
        {
          id: 1,
          studentId: 1,
          studentName: 'Amina Hassan',
          studentEmail: 'amina.hassan@email.com',
          studentAvatar: 'AH',
          subject: 'Request for Advanced Borana Course',
          message: 'I have completed the basic Borana course and would like to enroll in an advanced level course. Could you please let me know when it will be available? I am particularly interested in advanced grammar and conversation skills.',
          type: 'course_request',
          status: 'resolved',
          priority: 'medium',
          createdAt: '2024-01-15T10:30:00Z',
          adminResponse: 'Thank you for your interest! We are planning to launch the Advanced Borana course in March 2024. You will be notified via email once enrollment opens. We appreciate your dedication to learning.',
          respondedBy: 'Admin Team',
          respondedAt: '2024-01-16T09:15:00Z',
          isRead: true,
          requestedCourse: {
            title: 'Advanced Borana Language',
            description: 'Advanced grammar and conversation skills',
            category: 'Language',
            language: 'Borana'
          }
        },
        {
          id: 2,
          studentId: 2,
          studentName: 'Mohamed Ali',
          studentEmail: 'mohamed.ali@email.com',
          studentAvatar: 'MA',
          subject: 'Technical Issue with Video Playback',
          message: 'I am experiencing issues with video playback in the Somali Conversation course. The videos are not loading properly and I get an error message saying "Failed to load video". This has been happening for the past 3 days.',
          type: 'technical',
          status: 'in_progress',
          priority: 'high',
          createdAt: '2024-01-20T14:22:00Z',
          adminResponse: 'We are aware of this issue and our technical team is working on a fix. We apologize for the inconvenience. As a temporary workaround, please try clearing your browser cache.',
          respondedBy: 'Tech Support',
          respondedAt: '2024-01-20T16:45:00Z',
          isRead: true
        },
        {
          id: 3,
          studentId: 3,
          studentName: 'Fatima Omar',
          studentEmail: 'fatima.omar@email.com',
          studentAvatar: 'FO',
          subject: 'Question about Course Certificates',
          message: 'How do I download my certificate for the completed Basic Oromo course? I cannot find the download link in my profile section. I need this certificate for my job application.',
          type: 'support',
          status: 'resolved',
          priority: 'low',
          createdAt: '2024-01-18T11:15:00Z',
          adminResponse: 'You can download your certificate from the "My Courses" section. Click on the completed course and look for the "Download Certificate" button at the bottom. If you still cannot find it, please let us know and we can email it to you directly.',
          respondedBy: 'Support Team',
          respondedAt: '2024-01-18T13:30:00Z',
          isRead: true
        },
        {
          id: 4,
          studentId: 4,
          studentName: 'John Smith',
          studentEmail: 'john.smith@email.com',
          studentAvatar: 'JS',
          subject: 'Feedback on Cultural Studies Course',
          message: 'I really enjoyed the Cultural Studies course but felt that more interactive content would be beneficial. Are there plans to add more interactive elements like quizzes or virtual tours? The current content is great but could be more engaging.',
          type: 'general',
          status: 'pending',
          priority: 'low',
          createdAt: '2024-01-21T09:45:00Z',
          isRead: false
        },
        {
          id: 5,
          studentId: 5,
          studentName: 'Sara Ahmed',
          studentEmail: 'sara.ahmed@email.com',
          studentAvatar: 'SA',
          subject: 'Unable to Access Course Materials',
          message: 'I cannot access the downloadable materials for the Oromo Grammar course. When I click on the download links, nothing happens. I have tried different browsers but the issue persists.',
          type: 'technical',
          status: 'pending',
          priority: 'urgent',
          createdAt: '2024-01-21T11:20:00Z',
          isRead: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.type === filterType);
    }

    // Sort by creation date (newest first), with pending messages prioritized
    filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredMessages(filtered);
    setCurrentPage(1);
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    setResponseText(message.adminResponse || '');
    
    // Mark as read if not already
    if (!message.isRead) {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    try {
      setSubmittingResponse(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { 
              ...msg, 
              adminResponse: responseText,
              respondedBy: 'Admin',
              respondedAt: new Date().toISOString(),
              status: 'resolved'
            } 
          : msg
      ));

      setShowMessageModal(false);
      setSelectedMessage(null);
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-700 bg-red-100';
      case 'high':
        return 'text-orange-700 bg-orange-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course_request':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'technical':
        return <Settings className="w-4 h-4 text-red-600" />;
      case 'support':
        return <HelpCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return time.toLocaleDateString();
  };

  const getCurrentPageMessages = () => {
    const startIndex = (currentPage - 1) * messagesPerPage;
    const endIndex = startIndex + messagesPerPage;
    return filteredMessages.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const MessageCard = ({ message }) => (
    <div className={`bg-white rounded-lg shadow-sm border ${!message.isRead ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'} p-6 hover:shadow-md transition-shadow`}>
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
              Course: {message.requestedCourse.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
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
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages & Support</h2>
          <p className="text-gray-600 mt-1">
            Manage student inquiries and support requests
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {messages.filter(m => m.status === 'pending').length} Pending
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {messages.filter(m => m.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.status === 'in_progress').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="course_request">Course Requests</option>
              <option value="technical">Technical Issues</option>
              <option value="support">Support</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No support messages have been received yet'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {getCurrentPageMessages().map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * messagesPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * messagesPerPage, filteredMessages.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{filteredMessages.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">{selectedMessage.studentAvatar}</span>
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
                  ×
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
                    <h4 className="font-medium text-purple-900 mb-3">Requested Course Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-purple-800">Title:</span>
                        <span className="text-purple-700 ml-2">{selectedMessage.requestedCourse.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Category:</span>
                        <span className="text-purple-700 ml-2">{selectedMessage.requestedCourse.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Language:</span>
                        <span className="text-purple-700 ml-2">{selectedMessage.requestedCourse.language}</span>
                      </div>
                    </div>
                    {selectedMessage.requestedCourse.description && (
                      <div className="mt-3">
                        <span className="font-medium text-purple-800">Description:</span>
                        <p className="text-purple-700 mt-1">{selectedMessage.requestedCourse.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Previous Response */}
                {selectedMessage.adminResponse && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Previous Response</h4>
                    <p className="text-green-800 mb-3">{selectedMessage.adminResponse}</p>
                    <div className="flex items-center justify-between text-xs text-green-600">
                      <span>By: {selectedMessage.respondedBy}</span>
                      <span>{new Date(selectedMessage.respondedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">
                    {selectedMessage.adminResponse ? 'Update Response' : 'Send Response'}
                  </h4>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    rows={6}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-blue-900">Update Status:</label>
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                        className="border border-blue-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={handleSubmitResponse}
                      disabled={submittingResponse || !responseText.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex items-center space-x-3 mt-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View Student Profile</span>
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Send Direct Message</span>
                    </button>
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