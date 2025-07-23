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
    publishedCourses: 0
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

      console.log('🔄 Starting API calls...');

      // Test each API call individually
      let statsResponse, activitiesResponse, messagesResponse;

      try {
        console.log('📊 Calling adminAPI.getStats()...');
        statsResponse = await adminAPI.getStats();
        console.log('✅ Stats Response:', statsResponse);
        console.log('📋 Stats Data Structure:', JSON.stringify(statsResponse.data, null, 2));
      } catch (statsError) {
        console.error('❌ Stats API Error:', statsError);
        throw new Error(`Stats API failed: ${statsError.message}`);
      }

      try {
        console.log('📈 Calling adminAPI.getRecentActivities()...');
        activitiesResponse = await adminAPI.getRecentActivities();
        console.log('✅ Activities Response:', activitiesResponse);
      } catch (activitiesError) {
        console.error('❌ Activities API Error:', activitiesError);
        // Don't throw - activities are not critical
      }

      try {
        console.log('💬 Calling messageAPI.getAdminMessages()...');
        messagesResponse = await messageAPI.getAdminMessages({ status: 'pending', limit: 5 });
        console.log('✅ Messages Response:', messagesResponse);
      } catch (messagesError) {
        console.error('❌ Messages API Error:', messagesError);
        // Don't throw - messages are not critical
      }

      // Process stats data with multiple fallback options
      let statsData = {};
      
      if (statsResponse?.data?.data?.stats) {
        console.log('✅ Using nested stats structure');
        statsData = statsResponse.data.data.stats;
      } else if (statsResponse?.data?.stats) {
        console.log('✅ Using direct stats structure');
        statsData = statsResponse.data.stats;
      } else if (statsResponse?.data) {
        console.log('✅ Using data as stats');
        statsData = statsResponse.data;
      } else {
        console.log('❌ No valid stats structure found');
        throw new Error('Invalid stats response structure');
      }

      console.log('📊 Final Stats Data:', statsData);

      // Process activities
      const activitiesData = activitiesResponse?.data?.data?.activities || 
                           activitiesResponse?.data?.activities || 
                           activitiesResponse?.data || 
                           [];

      // Process messages
      const messagesData = messagesResponse?.data?.data?.messages || 
                          messagesResponse?.data?.messages || 
                          messagesResponse?.data || 
                          [];

      // Update state
      setStats({
        totalStudents: statsData.totalStudents || 0,
        totalCourses: statsData.totalCourses || statsData.activeCourses || 0,
        totalEnrollments: statsData.totalEnrollments || 0,  
        newStudentsThisMonth: statsData.newStudentsThisMonth || 0,
        publishedCourses: statsData.publishedCourses || 0
      });

      setRecentActivity(Array.isArray(activitiesData) ? activitiesData : []);
      setPendingMessages(Array.isArray(messagesData) ? messagesData : []);

      console.log('✅ All data processed successfully');

    } catch (error) {
      console.error('💥 Error fetching dashboard data:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageAction = async (messageId, action) => {
    try {
      if (action === 'resolve') {
        await messageAPI.updateMessageStatus(messageId, 'resolved');
      }
      // Refresh pending messages
      const response = await messageAPI.getAdminMessages({ status: 'pending', limit: 5 });
      setPendingMessages(response.data.data.messages || []);
    } catch (error) {
      console.error('Error updating message:', error);
    }
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

  console.log('🎨 Rendering with stats:', stats);

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-blue-800">Debug Info:</h4>
        <pre className="text-blue-700 mt-1 overflow-auto">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon={Users}
          color="blue"
          trend={`+${stats.newStudentsThisMonth || 0} this month`}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses || 0}
          icon={BookOpen}
          color="green"
          trend={`${stats.publishedCourses || 0} published`}
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments || 0}
          icon={TrendingUp}
          color="purple"
          trend="Active learning"
        />
        <StatCard
          title="Messages"
          value={pendingMessages.length}
          icon={MessageSquare}
          color="orange"
          trend="Pending responses"
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
              recentActivity.map((activity, index) => (
                <ActivityItem key={activity.id || index} activity={activity} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
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
            {pendingMessages.map((message) => (
              <div key={message._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{message.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {message.studentId?.name || 'Unknown Student'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMessageAction(message._id, 'resolve')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingMessages.length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending messages</p>
            )}
          </div>
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
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment': return UserCheck;
      case 'completion': return CheckCircle2;
      case 'message': return MessageSquare;
      case 'registration': return Users;
      case 'course_update': return BookOpen;
      default: return Clock;
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {activity.user} • {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AdminOverview;