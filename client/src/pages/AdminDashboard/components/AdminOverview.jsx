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

const AdminOverview = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 1234,
        activeStudents: 1180,
        totalCourses: 28,
        publishedCourses: 25,
        totalMessages: 89,
        pendingMessages: 15,
        newStudentsThisMonth: 156,
        courseCompletionRate: 78,
        averageRating: 4.6,
        totalEnrollments: 3456
      });

      setRecentActivity([
        {
          id: 1,
          type: 'enrollment',
          message: 'New student enrolled in "Basic Oromo Language"',
          user: 'Amina Hassan',
          timestamp: '2024-01-21T10:30:00Z',
          avatar: 'AH'
        },
        {
          id: 2,
          type: 'completion',
          message: 'Student completed "Somali Conversation Skills"',
          user: 'Mohamed Ali',
          timestamp: '2024-01-21T09:15:00Z',
          avatar: 'MA'
        },
        {
          id: 3,
          type: 'message',
          message: 'New course request for Advanced Grammar',
          user: 'Fatima Omar',
          timestamp: '2024-01-21T08:45:00Z',
          avatar: 'FO'
        },
        {
          id: 4,
          type: 'registration',
          message: 'New student registered on platform',
          user: 'John Smith',
          timestamp: '2024-01-20T16:20:00Z',
          avatar: 'JS'
        },
        {
          id: 5,
          type: 'course_update',
          message: 'Course "Cultural Studies" was updated',
          user: 'Admin',
          timestamp: '2024-01-20T14:30:00Z',
          avatar: 'AD'
        }
      ]);

      setPendingRequests([
        {
          id: 1,
          type: 'course_request',
          subject: 'Advanced Borana Grammar Course',
          student: 'Ahmed Hassan',
          priority: 'high',
          createdAt: '2024-01-20T11:30:00Z'
        },
        {
          id: 2,
          type: 'technical',
          subject: 'Video playback issues in mobile app',
          student: 'Sara Mohamed',
          priority: 'urgent',
          createdAt: '2024-01-20T14:15:00Z'
        },
        {
          id: 3,
          type: 'support',
          subject: 'Certificate download problem',
          student: 'Omar Ali',
          priority: 'medium',
          createdAt: '2024-01-21T09:00:00Z'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, changeType, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            changeType === 'positive' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}>
            {changeType === 'positive' ? '+' : ''}{change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'enrollment': return <BookOpen className="w-4 h-4 text-blue-600" />;
        case 'completion': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        case 'message': return <MessageSquare className="w-4 h-4 text-purple-600" />;
        case 'registration': return <UserCheck className="w-4 h-4 text-orange-600" />;
        case 'course_update': return <BookOpen className="w-4 h-4 text-gray-600" />;
        default: return <Clock className="w-4 h-4 text-gray-600" />;
      }
    };

    const timeAgo = (timestamp) => {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-600">{activity.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getActivityIcon(activity.type)}
                <span className="text-xs text-gray-500">{activity.user}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{timeAgo(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RequestCard = ({ request }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'urgent': return 'text-red-700 bg-red-100';
        case 'high': return 'text-orange-700 bg-orange-100';
        case 'medium': return 'text-yellow-700 bg-yellow-100';
        case 'low': return 'text-green-700 bg-green-100';
        default: return 'text-gray-700 bg-gray-100';
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case 'course_request': return <BookOpen className="w-4 h-4 text-purple-600" />;
        case 'technical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
        case 'support': return <MessageSquare className="w-4 h-4 text-blue-600" />;
        default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
      }
    };

    return (
      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start space-x-2 flex-1">
            {getTypeIcon(request.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{request.subject}</h4>
              <p className="text-xs text-gray-600">by {request.student}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
            {request.priority}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
        </div>
      </div>
    );
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-blue-100">
              Manage your Cushite learning platform efficiently. Monitor student progress, 
              add new courses, and respond to student requests.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <div className="text-sm text-blue-100">Active Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.pendingMessages}</div>
              <div className="text-sm text-blue-100">Pending</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>View Students</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents?.toLocaleString()}
          change={stats.newStudentsThisMonth}
          changeType="positive"
          color="bg-blue-500"
          subtitle="Active learners"
        />
        <StatCard
          icon={BookOpen}
          title="Published Courses"
          value={stats.publishedCourses}
          change={`${stats.totalCourses - stats.publishedCourses} draft`}
          changeType="neutral"
          color="bg-green-500"
          subtitle="Available to students"
        />
        <StatCard
          icon={TrendingUp}
          title="Completion Rate"
          value={`${stats.courseCompletionRate}%`}
          change="5%"
          changeType="positive"
          color="bg-purple-500"
          subtitle="Course completion"
        />
        <StatCard
          icon={MessageSquare}
          title="Support Requests"
          value={stats.pendingMessages}
          change={stats.totalMessages - stats.pendingMessages + " resolved"}
          changeType="positive"
          color="bg-orange-500"
          subtitle="Pending response"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-1">
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {pendingRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
            
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
              View All Messages
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{stats.averageRating}/5.0</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Enrollments</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalEnrollments?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New This Month</span>
                <span className="text-sm font-medium text-green-600">+{stats.newStudentsThisMonth}</span>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Students</span>
                <span className="text-sm font-medium text-blue-600">+{stats.newStudentsThisMonth}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Courses Completed</span>
                <span className="text-sm font-medium text-green-600">+247</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Support Tickets</span>
                <span className="text-sm font-medium text-orange-600">{stats.totalMessages}</span>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm">
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;