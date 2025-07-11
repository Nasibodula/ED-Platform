import React, { useState, useEffect } from 'react';
import { User, Book, BookOpen, MessageSquare, Download, Users, Clock, Award, TrendingUp, Star, Bell, Search, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { userAPI } from '../utils/api';

const Dashboard = () => {
  // const [userName, setUserName] = useState('Dula');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      // Small delay to ensure token is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const token = localStorage.getItem('token');
      console.log('Token check:', token); // Debug log
      
      // if (!token) {
      //   window.location.href = '/dashboard';
      //   return;
      // }

      const response = await userAPI.getProfile();
      setUserName(response.data.fullName || 'User');
      setUserEmail(response.data.email || '');
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
      setUserName('User');
      setLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  const stats = [
    { label: 'Total Hours', value: '110h', change: '+10%', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Completed Course', value: '150', change: '+25%', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Total Student', value: '220k', change: '+20%', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  ];

  const courses = [
    {  
      title: 'BOOK COVER DESIGN', 
      level: 'Beginner', 
      students: 120, 
      rating: 5, 
      color: 'bg-gradient-to-br from-teal-400 to-teal-600',
      description: 'Three-month course to learn the basics of Python and start coding.',
      lastAccessed: 'Today'
    },
    { 
      title: 'Online Book Maker', 
      level: 'Beginner', 
      students: 120, 
      rating: 5, 
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      description: 'Three-month course to learn the basics of Python and start coding.',
      lastAccessed: 'Yesterday'
    },
    { 
      title: 'eBook Cover MAKER', 
      level: 'Beginner', 
      students: 120, 
      rating: 5, 
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      description: 'Three-month course to learn the basics of Python and start coding.',
      lastAccessed: '3 days ago'
    },
  ];
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-teal-950 shadow-sm   p-6">
          <div className="flex items-center justify-between">
            <div>
              {/* <p className="text-white mt-1">Welcome back, {userName}!</p> */}
              <p className="text-white mt-1">
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                `Welcome back, ${userName}!`
              )}
              </p>
              {error && (
              <p className="text-red-300 text-sm mt-1">{error}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Clock className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Course</h2>
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4`}>
                        {course.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">{course.level}</span>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.students}
                          </div>
                          <div className="flex items-center">
                            {[...Array(course.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Last accessed: {course.lastAccessed}</p>
                      </div>
                      <button className="ml-auto bg-indigo-100 text-indigo-700 p-2 rounded-full hover:bg-indigo-200 transition-colors duration-200">
                        <Book className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Language Advisor */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Language Advisor</h2>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Fatima Hassan</h3>
                  <p className="text-gray-600 text-sm mt-1">+251 912 345 678</p>
                  <p className="text-gray-600 text-sm">fatima@cushilearn.org</p>
                  
                  <button className="mt-4 w-full bg-indigo-950 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-900 transition-colors duration-200">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SEND MESSAGE
                  </button>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Oromo Basics</span>
                      <span className="text-sm font-medium text-gray-700">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Mathematics</span>
                      <span className="text-sm font-medium text-gray-700">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Science</span>
                      <span className="text-sm font-medium text-gray-700">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Download */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Download our mobile app</h2>
                <p className="text-gray-600 mb-6 text-sm">For a better offline learning experience</p>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center bg-black text-white rounded-lg px-4 py-3 hover:bg-gray-800 transition-colors duration-200">
                    <div className="w-6 h-6 mr-3 flex items-center justify-center bg-white rounded-md">
                      <span className="text-black text-xs font-bold">A</span>
                    </div>
                    <span className="text-sm font-medium">Download on App Store</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center bg-indigo-950 text-white rounded-lg px-4 py-3 hover:bg-indigo-900 transition-colors duration-200">
                    <Download className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">Download on Play Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;