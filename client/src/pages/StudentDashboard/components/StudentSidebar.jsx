import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  Languages,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Progress'
    },
    {
      name: 'My Courses',
      path: '/student/courses',
      icon: BookOpen,
      description: 'Enrolled Courses'
    },
    {
      name: 'Profile',
      path: '/student/profile',
      icon: User,
      description: 'Account Settings'
    },
    {
      name: 'Translator',
      path: '/student/translator',
      icon: Languages,
      description: 'Language Helper'
    },
    {
      name: 'Support',
      path: '/student/support',
      icon: HelpCircle,
      description: 'Get Help'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-green-800 to-green-900 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            {isOpen && (
              <div>
                <span className="font-semibold text-lg">CushLearn</span>
                <p className="text-xs text-green-200">Student Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-green-700 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="p-4 border-b border-green-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-green-200 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-white text-green-800 shadow-lg'
                          : 'text-green-100 hover:bg-green-700 hover:text-white'
                      } ${!isOpen && 'justify-center'}`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <div className="flex-1 min-w-0">
                        <span className="font-medium block truncate">{item.name}</span>
                        <span className="text-xs opacity-75 block truncate">
                          {item.description}
                        </span>
                      </div>
                    )}
                    {!isOpen && (
                      <div className="absolute left-16 bg-gray-900 text-white px-3 py-2 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-300">{item.description}</div>
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings & Logout */}
        <div className="p-3 border-t border-green-700 space-y-2">
          <NavLink
            to="/student/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-white text-green-800'
                  : 'text-green-100 hover:bg-green-700 hover:text-white'
              } ${!isOpen && 'justify-center'}`
            }
          >
            <Settings className="w-5 h-5" />
            {isOpen && <span className="font-medium">Settings</span>}
            {!isOpen && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Settings
              </div>
            )}
          </NavLink>
          
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-green-100 hover:bg-red-600 hover:text-white w-full group ${
              !isOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="font-medium">Logout</span>}
            {!isOpen && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default StudentSidebar;