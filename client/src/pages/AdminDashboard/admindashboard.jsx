import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminOverview from './components/AdminOverview';
import AdminStudents from './components/AdminStudents';
import AdminMessages from './components/AdminMessages';
import { useAuth } from '../../contexts/AuthContext';

// Placeholder components for missing admin pages
const AdminCourses = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Course Management</h2>
      <p className="text-purple-100">Create, edit, and manage courses for your students</p>
    </div>
    
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Management System</h3>
        <p className="text-gray-600 mb-6">
          Add new courses, manage existing ones, and track course performance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Add New Course</h4>
            <p className="text-blue-700 text-sm mb-4">Create courses with lessons, videos, and assessments</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Course
            </button>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Manage Existing</h4>
            <p className="text-green-700 text-sm mb-4">Edit course content, update materials, and track progress</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Courses
            </button>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Course Analytics</h4>
            <p className="text-purple-700 text-sm mb-4">Monitor enrollment, completion rates, and student feedback</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminAnalytics = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
      <p className="text-indigo-100">Monitor platform performance and user engagement</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h4>
        <p className="text-3xl font-bold text-gray-900">$12,450</p>
        <p className="text-sm text-green-600">+12% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Course Completions</h4>
        <p className="text-3xl font-bold text-gray-900">89%</p>
        <p className="text-sm text-blue-600">+5% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Average Rating</h4>
        <p className="text-3xl font-bold text-gray-900">4.6</p>
        <p className="text-sm text-purple-600">+0.2 from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Active Users</h4>
        <p className="text-3xl font-bold text-gray-900">1,234</p>
        <p className="text-sm text-orange-600">+8% from last month</p>
      </div>
    </div>
    
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
        <p className="text-gray-600 mb-6">
          Comprehensive reports and insights about your platform performance
        </p>
        <div className="bg-gray-100 p-8 rounded-lg">
          <p className="text-gray-600">📊 Advanced analytics charts and reports will be displayed here</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">System Settings</h2>
      <p className="text-gray-200">Configure platform settings and preferences</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
            <input 
              type="text" 
              value="CushLearn" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
              <option>English</option>
              <option>Oromo</option>
              <option>Somali</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox text-blue-600" defaultChecked />
            <span className="text-sm text-gray-700">Email notifications for new registrations</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox text-blue-600" defaultChecked />
            <span className="text-sm text-gray-700">Email notifications for support requests</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-sm text-gray-700">SMS notifications for urgent issues</span>
          </label>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Password Requirements</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Minimum 8 characters</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Require uppercase letters</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Require numbers</span>
            </label>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Session Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>24 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Administrator
              </div>
              {/* Notification Bell */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17v-7a8 8 0 1 1 16 0v7" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Admin Avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/dashboard" element={<AdminOverview />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/messages" element={<AdminMessages />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;