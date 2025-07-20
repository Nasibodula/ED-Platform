import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageSquare,
  Plus,
  Eye
} from 'lucide-react';

const AdminOverview = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Courses',
      value: '28',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Course Completions',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Messages',
      value: '15',
      change: '+8',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in "Basic Cushite Language"',
      time: '2 hours ago',
      student: 'John Doe'
    },
    {
      id: 2,
      type: 'completion',
      message: 'Student completed "Cushite Grammar Basics"',
      time: '4 hours ago',
      student: 'Jane Smith'
    },
    {
      id: 3,
      type: 'message',
      message: 'New course request received',
      time: '6 hours ago',
      student: 'Mike Johnson'
    },
    {
      id: 4,
      type: 'enrollment',
      message: 'New student registered on the platform',
      time: '1 day ago',
      student: 'Sarah Wilson'
    }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-blue-100">
          Manage your Cushite learning platform efficiently. Monitor student progress, 
          add new courses, and respond to student requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              <span className="text-gray-600 group-hover:text-blue-600">Add New Course</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors group">
              <Eye className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              <span className="text-gray-600 group-hover:text-green-600">View All Students</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
              <span className="text-gray-600 group-hover:text-purple-600">Check Messages</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{activity.student}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Server Status</p>
            <p className="text-xs text-gray-600">Online</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-gray-600">Connected</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">API Services</p>
            <p className="text-xs text-gray-600">Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;