import React from 'react';
import { Plus, Eye, MessageSquare } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Add New Course',
      hoverColor: 'hover:border-blue-500 hover:bg-blue-50',
      iconHoverColor: 'group-hover:text-blue-500',
      textHoverColor: 'group-hover:text-blue-600'
    },
    {
      icon: Eye,
      label: 'View All Students',
      hoverColor: 'hover:border-green-500 hover:bg-green-50',
      iconHoverColor: 'group-hover:text-green-500',
      textHoverColor: 'group-hover:text-green-600'
    },
    {
      icon: MessageSquare,
      label: 'Check Messages',
      hoverColor: 'hover:border-purple-500 hover:bg-purple-50',
      iconHoverColor: 'group-hover:text-purple-500',
      textHoverColor: 'group-hover:text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button 
              key={index}
              className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg border-2 border-dashed border-gray-300 ${action.hoverColor} transition-colors group`}
            >
              <Icon className={`w-5 h-5 text-gray-400 ${action.iconHoverColor}`} />
              <span className={`text-gray-600 ${action.textHoverColor}`}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;