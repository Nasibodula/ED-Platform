import React from 'react';

const RecentActivity = () => {
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

  return (
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
  );
};

export default RecentActivity;