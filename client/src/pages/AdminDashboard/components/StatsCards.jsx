import React from 'react';

const StatsCard = ({ stat }) => {
  const Icon = stat.icon;
  
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
};

export default StatsCard;