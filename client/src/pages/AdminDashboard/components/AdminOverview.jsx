import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageSquare,
  Plus,
  Eye,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';
import { adminAPI, messageAPI } from '../../../utils/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    newStudentsThisMonth: 0,
    publishedCourses: 0,
    pendingMessages: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log(' Starting API calls...');

      // Fetch admin stats
      let statsData = {
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        newStudentsThisMonth: 0,
        publishedCourses: 0
      };

      try {
        console.log(' Calling adminAPI.getStats()...');
        const statsResponse = await adminAPI.getStats();
        console.log(' Stats Response:', statsResponse);
        
        // Handle multiple possible response structures
        if (statsResponse?.data?.data?.data?.stats) {
          statsData = statsResponse.data.data.data.stats;
        } else if (statsResponse?.data?.data?.stats) {
          statsData = statsResponse.data.data.stats;
        } else if (statsResponse?.data?.stats) {
          statsData = statsResponse.data.stats;
        } else if (statsResponse?.data?.data) {
          statsData = statsResponse.data.data;
        } else if (statsResponse?.data) {
          statsData = statsResponse.data;
        }
        
        console.log(' Extracted Stats Data:', statsData);
      } catch (statsError) {
        console.error(' Stats API Error:', statsError);
        // Use fallback data for demo
        statsData = {
          totalStudents: 25,
          totalCourses: 8,
          totalEnrollments: 156,
          newStudentsThisMonth: 5,
          publishedCourses: 6
        };
      }

      // Fetch messages
      let messagesData = [];
      try {
        console.log(' Calling messageAPI.getAllMessages()...');
        const messagesResponse = await messageAPI.getAllMessages({ 
          status: 'pending', 
          limit: 5 
        });
        console.log(' Messages Response:', messagesResponse);
        
        if (messagesResponse?.data?.data?.messages) {
          messagesData = messagesResponse.data.data.messages;
        } else if (messagesResponse?.data?.messages) {
          messagesData = messagesResponse.data.messages;
        } else if (Array.isArray(messagesResponse?.data)) {
          messagesData = messagesResponse.data;
        }
      } catch (messagesError) {
        console.error(' Messages API Error:', messagesError);
        // Mock data for demo
        messagesData = [
          {
            _id: '1',
            subject: 'Course Access Issue',
            message: 'I cannot access my enrolled course materials.',
            type: 'technical',
            priority: 'high',
            status: 'pending',
            studentId: { name: 'John Doe', email: 'john@student.com' },
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            _id: '2',
            subject: 'Request for Advanced Oromo Course',
            message: 'Can you add an advanced Oromo language course?',
            type: 'course_request',
            priority: 'medium',
            status: 'pending',
            studentId: { name: 'Jane Smith', email: 'jane@student.com' },
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ];
      }

      // Fetch recent activities
      let activitiesData = [];
      try {
        console.log(' Calling adminAPI.getRecentActivities()...');
        const activitiesResponse = await adminAPI.getRecentActivities();
        console.log(' Activities Response:', activitiesResponse);
        
        if (activitiesResponse?.data?.data?.data?.activities) {
          activitiesData = activitiesResponse.data.data.data.activities;
        } else if (activitiesResponse?.data?.data?.activities) {
          activitiesData = activitiesResponse.data.data.activities;
        } else if (activitiesResponse?.data?.activities) {
          activitiesData = activitiesResponse.data.activities;
        } else if (Array.isArray(activitiesResponse?.data?.data)) {
          activitiesData = activitiesResponse.data.data;
        } else if (Array.isArray(activitiesResponse?.data)) {
          activitiesData = activitiesResponse.data;
        }
      } catch (activitiesError) {
        console.error(' Activities API Error:', activitiesError);
        // Mock data for demo
        activitiesData = [
          {
            id: '1',
            type: 'registration',
            message: 'John Doe registered as a new student',
            user: 'John Doe',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            type: 'course_update',
            message: 'New course "Basic Oromo" was created',
            user: 'Admin',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ];
      }

      // Transform messages for display
      const transformedMessages = messagesData.map(msg => ({
        id: msg._id || msg.id,
        subject: msg.subject,
        message: msg.message,
        type: msg.type,
        priority: msg.priority,
        status: msg.status,
        studentName: msg.studentId?.name || 'Unknown Student',
        studentEmail: msg.studentId?.email || 'No email',
        createdAt: msg.createdAt
      }));

      // Update state
      setStats({
        totalStudents: statsData.totalStudents || 0,
        totalCourses: statsData.totalCourses || 0,
        totalEnrollments: statsData.totalEnrollments || 0,
        newStudentsThisMonth: statsData.newStudentsThisMonth || 0,
        publishedCourses: statsData.publishedCourses || 0,
        pendingMessages: transformedMessages.length
      });

      setRecentActivity(activitiesData);
      setPendingMessages(transformedMessages);

      console.log('All data processed successfully');

    } catch (error) {
      console.error(' Error fetching dashboard data:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
      
      // Set fallback stats for demo
      setStats({
        totalStudents: 25,
        totalCourses: 8,
        totalEnrollments: 156,
        newStudentsThisMonth: 5,
        publishedCourses: 6,
        pendingMessages: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageAction = async (messageId, action) => {
    try {
      if (action === 'resolve') {
        await messageAPI.updateMessageStatus(messageId, 'resolved');
        // Refresh pending messages
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'course_update':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'enrollment':
        return <Plus className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-blue-100">Monitor your platform's performance and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
          trend={`+${stats.newStudentsThisMonth} this month`}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          color="green"
          trend={`${stats.publishedCourses} published`}
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={TrendingUp}
          color="purple"
          trend="Active learning"
        />
        <StatCard
          title="Pending Messages"
          value={stats.pendingMessages}
          icon={MessageSquare}
          color="orange"
          trend="Need attention"
        />
      </div>

      {/* Recent Activity and Pending Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Messages */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Messages</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingMessages.length > 0 ? (
              pendingMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{message.subject}</h4>
                      <p className="text-xs text-gray-600 mt-1">From: {message.studentName}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(message.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                      <button
                        onClick={() => handleMessageAction(message.id, 'resolve')}
                        className="text-green-600 hover:text-green-700"
                        title="Mark as resolved"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No pending messages</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add New Course"
            description="Create a new course"
            icon={Plus}
            color="blue"
            onClick={() => console.log('Navigate to add course')}
          />
          <QuickActionCard
            title="View All Students"
            description="Manage student accounts"
            icon={Users}
            color="green"
            onClick={() => console.log('Navigate to students')}
          />
          <QuickActionCard
            title="Check Messages"
            description="Respond to inquiries"
            icon={MessageSquare}
            color="orange"
            onClick={() => console.log('Navigate to messages')}
          />
          <QuickActionCard
            title="View Analytics"
            description="Platform insights"
            icon={BarChart3}
            color="purple"
            onClick={() => console.log('Navigate to analytics')}
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 hover:bg-blue-200',
    green: 'text-green-600 bg-green-100 hover:bg-green-200',
    orange: 'text-orange-600 bg-orange-100 hover:bg-orange-200',
    purple: 'text-purple-600 bg-purple-100 hover:bg-purple-200',
  };

  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </button>
  );
};

export default AdminOverview;