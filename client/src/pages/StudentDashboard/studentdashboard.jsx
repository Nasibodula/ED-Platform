import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentOverview from './components/StudentOverview';
import StudentCourses from './components/StudentCourses';
import StudentProfile from './components/StudentProfile';
import StudentSupport from './components/StudentSupport';
import { useAuth } from '../../contexts/AuthContext';

// Placeholder components for missing pages
const StudentTranslator = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Language Translator</h2>
      <p className="text-gray-600 mb-6">
        Access our built-in translator to help with your language learning journey.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          🔄 Redirecting to main translator... This feature integrates with your existing translator page.
        </p>
      </div>
    </div>
  </div>
);

const StudentSettings = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600 mb-6">
        Advanced settings and preferences are managed in your profile.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700">
          📝 Please use the Profile tab to update your account settings, preferences, and security options.
        </p>
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Student Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Student
              </div>
              {/* Add notification bell or other header items here */}
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
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
            <Route path="/" element={<StudentOverview />} />
            <Route path="/dashboard" element={<StudentOverview />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/translator" element={<StudentTranslator />} />
            <Route path="/support" element={<StudentSupport />} />
            <Route path="/settings" element={<StudentSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;