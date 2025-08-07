import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://cush-learn-node.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getDashboardStats: () => api.get('/users/dashboard/stats'),
  getAllStudents: (params) => api.get('/users/students', { params }),
  deactivateUser: (userId) => api.put(`/users/${userId}/deactivate`),
  activateUser: (userId) => api.put(`/users/${userId}/activate`),
  updateCourseProgress: (courseId, progress) => api.put(`/users/progress/${courseId}`, { progress }),
};

// Course API
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  enrollInCourse: (id) => api.post(`/courses/${id}/enroll`),
  
  // Admin functions
  getAdminCourses: (params) => api.get('/courses/admin', { params }),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Student API
export const studentAPI = {
  getEnrolledCourses: () => api.get('/student/enrolled-courses'),
  getStats: () => api.get('/student/stats'),
  updateCourseProgress: (courseId, progress) => 
    api.put(`/student/courses/${courseId}/progress`, { progress }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getRecentActivities: () => api.get('/admin/recent-activities'),
};

// Message API - Complete implementation
export const messageAPI = {
  // Student functions
  createMessage: (messageData) => {
    console.log('API: Creating message with data:', messageData);
    return api.post('/messages', messageData);
  },
  
  getStudentMessages: (params = {}) => {
    console.log('API: Fetching student messages with params:', params);
    return api.get('/messages/my', { params });
  },
  
  // Admin functions  
  getAllMessages: (params = {}) => {
    console.log('API: Fetching all messages with params:', params);
    return api.get('/messages', { params });
  },
  
  getMessageById: (id) => {
    console.log('API: Fetching message by ID:', id);
    return api.get(`/messages/${id}`);
  },
  
  getMessageStats: () => {
    console.log('API: Fetching message stats');
    return api.get('/messages/stats');
  },
  
  updateMessageStatus: (id, status) => {
    console.log('API: Updating message status:', { id, status });
    return api.put(`/messages/${id}/status`, { status });
  },
  
  respondToMessage: (id, adminResponse, status = 'resolved') => {
    console.log('API: Responding to message:', { id, adminResponse, status });
    return api.put(`/messages/${id}/respond`, { adminResponse, status });
  },
  
  deleteMessage: (id) => {
    console.log('API: Deleting message:', id);
    return api.delete(`/messages/${id}`);
  },
  
  bulkUpdateMessages: (messageIds, action, value) => {
    console.log('API: Bulk updating messages:', { messageIds, action, value });
    return api.put('/messages/bulk', { messageIds, action, value });
  },
  
  // Legacy support for backward compatibility
  getAdminMessages: (params = {}) => {
    console.log('API: Fetching admin messages (legacy)');
    return api.get('/messages', { params }); 
  },
};

export default api;