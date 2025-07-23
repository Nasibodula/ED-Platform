// PlatformStatus.jsx
import React from 'react';

const PlatformStatus = () => {
  const statusItems = [
    {
      name: 'Server Status',
      status: 'Online',
      isOnline: true
    },
    {
      name: 'Database',
      status: 'Connected',
      isOnline: true
    },
    {
      name: 'API Services',
      status: 'Operational',
      isOnline: true
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-4 h-4 ${item.isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full mx-auto mb-2`}></div>
            <p className="text-sm font-medium text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-600">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStatus;