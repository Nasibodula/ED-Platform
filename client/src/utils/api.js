// import axios from 'axios';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   timeout: 10000,
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('token');
//       window.location.href = '/dashboard';
//     }
//     return Promise.reject(error);
//   }
// );

// // API functions
// export const userAPI = {
//   // Get user profile
//   getProfile: () => api.get('/user/profile'),
  
//   // Update user profile
//   updateProfile: (userData) => api.put('/user/profile', userData),
// };

// export const authAPI = {
//   // Login
//   login: (credentials) => api.post('/auth/login', credentials),
  
//   // Register
//   register: (userData) => api.post('/auth/register', userData),
  
//   // Logout
//   logout: () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   },
// };

// export default api;

// utils/api.js - Updated version
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      console.log('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Uncomment the line below if you want automatic redirect
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const userAPI = {
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  // getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Update user profile
  // updateProfile: (userData) => api.put('/user/profile', userData),
};

export const authAPI = {
  // Login - using your existing backend endpoint
  login: (credentials) => api.post('/auth/signin', credentials),
  
  // Register - using your existing backend endpoint  
  register: (userData) => api.post('/auth/signup', userData),
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;