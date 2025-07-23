import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Book,
  Settings,
  Search,
  Filter,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  X
} from 'lucide-react';

const StudentSupport = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    type: 'general',
    priority: 'medium',
    requestedCourse: {
      title: '',
      description: '',
      category: '',
      language: ''
    }
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, filterStatus, messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMessages = [
        {
          id: 1,
          subject: 'Request for Advanced Borana Course',
          message: 'I have completed the basic Borana course and would like to enroll in an advanced level course. Could you please let me know when it will be available?',
          type: 'course_request',
          status: 'resolved',
          priority: 'medium',
          createdAt: '2024-01-15T10:30:00Z',
          adminResponse: 'Thank you for your interest! We are planning to launch the Advanced Borana course in March 2024. You will be notified via email once enrollment opens.',
          respondedBy: 'Admin Team',
          respondedAt: '2024-01-16T09:15:00Z',
          requestedCourse: {
            title: 'Advanced Borana Language',
            description: 'Advanced grammar and conversation skills',
            category: 'Language',
            language: 'Borana'
          }
        },
        {
          id: 2,
          subject: 'Technical Issue with Video Playback',
          message: 'I am experiencing issues with video playback in the Somali Conversation course. The videos are not loading properly and I get an error message.',
          type: 'technical',
          status: 'in_progress',
          priority: 'high',
          createdAt: '2024-01-20T14:22:00Z',
          adminResponse: 'We are aware of this issue and our technical team is working on a fix. We apologize for the inconvenience.',
          respondedBy: 'Tech Support',
          respondedAt: '2024-01-20T16:45:00Z'
        },
        {
          id: 3,
          subject: 'Question about Course Certificates',
          message: 'How do I download my certificate for the completed Basic Oromo course? I cannot find the download link in my profile.',
          type: 'support',
          status: 'resolved',
          priority: 'low',
          createdAt: '2024-01-18T11:15:00Z',
          adminResponse: 'You can download your certificate from the "My Courses" section. Click on the completed course and look for the "Download Certificate" button. If you still cannot find it, please let us know.',
          respondedBy: 'Support Team',
          respondedAt: '2024-01-18T13:30:00Z'
        },
        {
          id: 4,
          subject: 'Feedback on Cultural Studies Course',
          message: 'I really enjoyed the Cultural Studies course but felt that more interactive content would be beneficial. Are there plans to add more interactive elements?',
          type: 'general',
          status: 'pending',
          priority: 'low',
          createdAt: '2024-01-21T09:45:00Z'
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
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredMessages(filtered);
  };

  const handleSubmitMessage = async () => {
    try {
      setSubmitting(true);
      // Mock API call - replace with actual submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new message to the list
      const newMsg = {
        id: Date.now(),
        ...newMessage,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [newMsg, ...prev]);
      setShowNewMessageModal(false);
      setNewMessage({
        subject: '',
        message: '',
        type: 'general',
        priority: 'medium',
        requestedCourse: {
          title: '',
          description: '',
          category: '',
          language: ''
        }
      });
      
      // Show success message
      console.log('Message submitted successfully');
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setSubmitting(false);
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

  const MessageCard = ({ message }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {getTypeIcon(message.type)}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{message.subject}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
            {getStatusIcon(message.status)}
            <span>{message.status.replace('_', ' ')}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Created: {new Date(message.createdAt).toLocaleDateString()}</span>
        <span className="capitalize">{message.priority} priority</span>
      </div>

      {message.adminResponse && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Admin Response</h4>
              <p className="text-blue-800 text-sm">{message.adminResponse}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-blue-600">
                <span>By: {message.respondedBy}</span>
                <span>{new Date(message.respondedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {message.type === 'course_request' && message.requestedCourse && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Requested Course Details</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p><strong>Title:</strong> {message.requestedCourse.title}</p>
            <p><strong>Category:</strong> {message.requestedCourse.category}</p>
            <p><strong>Language:</strong> {message.requestedCourse.language}</p>
            {message.requestedCourse.description && (
              <p><strong>Description:</strong> {message.requestedCourse.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Phone Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Call us for urgent matters</p>
          <a href="tel:+254123456789" className="text-purple-600 text-sm hover:text-purple-700">
            +254 123 456 789
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No messages found' : 'No support requests yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Have a question or need help? Send us a message!'
            }
          </p>
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Your First Message
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map(message => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">New Support Request</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select
                      value={newMessage.type}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Question</option>
                      <option value="course_request">Course Request</option>
                      <option value="technical">Technical Issue</option>
                      <option value="support">Account Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your request"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide detailed information about your request..."
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Course Request Fields */}
                {newMessage.type === 'course_request' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-4">Course Request Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          Course Title
                        </label>
                        <input
                          type="text"
                          value={newMessage.requestedCourse.title}
                          onChange={(e) => setNewMessage(prev => ({
                            ...prev,
                            requestedCourse: { ...prev.requestedCourse, title: e.target.value }
                          }))}
                          placeholder="What course would you like to see?"
                          className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Category
                          </label>
                          <input
                            type="text"
                            value={newMessage.requestedCourse.category}
                            onChange={(e) => setNewMessage(prev => ({
                              ...prev,
                              requestedCourse: { ...prev.requestedCourse, category: e.target.value }
                            }))}
                            placeholder="e.g., Language, Grammar, Culture"
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Language
                          </label>
                          <select
                            value={newMessage.requestedCourse.language}
                            onChange={(e) => setNewMessage(prev => ({
                              ...prev,
                              requestedCourse: { ...prev.requestedCourse, language: e.target.value }
                            }))}
                            className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select Language</option>
                            <option value="Oromo">Oromo</option>
                            <option value="Somali">Somali</option>
                            <option value="Borana">Borana</option>
                            <option value="Afar">Afar</option>
                            <option value="Mixed">Mixed Languages</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          Course Description
                        </label>
                        <textarea
                          value={newMessage.requestedCourse.description}
                          onChange={(e) => setNewMessage(prev => ({
                            ...prev,
                            requestedCourse: { ...prev.requestedCourse, description: e.target.value }
                          }))}
                          placeholder="Describe what you'd like to learn in this course..."
                          rows={3}
                          className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitMessage}
                    disabled={submitting || !newMessage.subject.trim() || !newMessage.message.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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