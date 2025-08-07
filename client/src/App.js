import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './pages/AdminDashboard/admindashboard';
import StudentDashboard from './pages/StudentDashboard/studentdashboard';
import './global.css'
import Homepage from './pages/Landingpage/Homepage';
import AboutPage from './pages/Landingpage/AboutPage';
import TranslationTool from './pages/Landingpage/ChatbotPage';
import FeaturesPage from './pages/Landingpage/FeaturesPage';
import Courses from './pages/Landingpage/CoursesPage';
import { Contact, ContactRound } from 'lucide-react';
import ContactPage from './pages/Landingpage/ContactPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes */}
            <Route path='/'  element={<Homepage/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chatbotpage" element = {<TranslationTool/>}/>
            <Route path='/featurespage'  element={<FeaturesPage/>}/>
            <Route path='/contact'  element={<ContactPage/>}/>
            <Route path='/servicespage'  element={<AboutPage/>}/>
            <Route path="/courses" element ={<Courses/>}/>
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
                        <Route 
              path="/student/*" 
              element={
                <ProtectedRoute requiredRole="student">
                  <TranslationTool />
                </ProtectedRoute>
              } 
            />
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;