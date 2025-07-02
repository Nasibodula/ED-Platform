import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignupPassword = () => {
    setShowSignupPassword(!showSignupPassword);
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
          <div className="bg-transparent bg-opacity-70 p-8 rounded-lg  w-full text-white">
            <h1 className="text-2xl font-semibold text-center mb-6">Sign in</h1>
            <form>
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
              </div>
              <div className="mb-4 relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={togglePassword} 
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Link to='/dashboard'>
              <button 
                type="submit" 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded font-medium transition-colors mt-4"
              >
                SIGN IN
              </button>
              </Link>
              <div className="flex justify-between mt-4">
                <a href="#" className="text-orange-400 text-sm hover:underline">Forgot your password?</a>
              </div>
            </form>
            <div className="text-center mt-6">
              <button 
                className="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-teal-950 transition-colors"
                onClick={toggleForm}
              >
                CREATE NEW ACCOUNT
              </button>
            </div>
          </div>
        )}

        {/* Signup Form */}
        {!showLogin && (
          <div className="bg-transparent bg-opacity-70 p-8 rounded-lg  w-full text-white">
            <h1 className="text-2xl font-semibold text-center mb-6">Create Account</h1>
            <form>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
              </div>
              <div className="mb-4 relative">
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={toggleSignupPassword} 
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full px-3 py-3 rounded border border-gray-200 text-black" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded font-medium transition-colors mt-4"
              >
                CREATE ACCOUNT
              </button>
            </form>
            <div className="text-center mt-6">
              <button 
                className="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-teal-950 transition-colors"
                onClick={toggleForm}
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