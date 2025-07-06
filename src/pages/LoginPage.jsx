import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setMessage({ type: '', text: '' });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignupPassword = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showMessage('success', 'Login successful! Redirecting...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        showMessage('error', data.message || 'Login failed');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Basic validation
    if (signupData.password !== signupData.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showMessage('success', 'Account created successfully! Redirecting...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        showMessage('error', data.message || 'Signup failed');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const MessageDisplay = ({ message }) => {
    if (!message.text) return null;
    
    return (
      <div className={`flex items-center gap-2 p-3 rounded mb-4 ${
        message.type === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {message.type === 'success' ? (
          <CheckCircle size={16} />
        ) : (
          <AlertCircle size={16} />
        )}
        <span className="text-sm">{message.text}</span>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('/assets/images/clouds.png')"
        }}
      ></div>
      
      {/* Translucent overlay */}
      <div 
        className="absolute inset-0 z-10 bg-teal-950 opacity-85"
      ></div>
      
      {/* Content layer */}
      <div className="relative z-20 w-full max-w-md">
        {/* Login Form */}
        {showLogin && (
          <div className="bg-transparent bg-opacity-70 p-8 rounded-lg w-full text-white">
            <h1 className="text-2xl font-semibold text-center mb-6">Sign in</h1>
            
            <MessageDisplay message={message} />
            
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4 relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required 
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  onClick={togglePassword} 
                  className="absolute right-3 top-3 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded font-medium transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    SIGNING IN...
                  </>
                ) : (
                  'SIGN IN'
                )}
              </button>
              
              <div className="flex justify-between mt-4">
                <a href="#" className="text-orange-400 text-sm hover:underline">Forgot your password?</a>
              </div>
            </form>
            
            <div className="text-center mt-6">
              <button 
                className="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-teal-950 transition-colors disabled:opacity-50"
                onClick={toggleForm}
                disabled={isLoading}
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
          </div>
        )}

        {/* Signup Form */}
        {!showLogin && (
          <div className="bg-transparent bg-opacity-70 p-8 rounded-lg w-full text-white">
            <h1 className="text-2xl font-semibold text-center mb-6">Create Account</h1>
            
            <MessageDisplay message={message} />
            
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Full Name" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4 relative">
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required 
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  onClick={toggleSignupPassword} 
                  className="absolute right-3 top-3 text-gray-500"
                  disabled={isLoading}
                >
                  {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded font-medium transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <button 
                className="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-teal-950 transition-colors disabled:opacity-50"
                onClick={toggleForm}
                disabled={isLoading}
              >
                BACK TO SIGN IN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;