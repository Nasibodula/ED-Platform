import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
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
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      console.log('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getDashboardStats: () => api.get('/users/dashboard/stats'),
  getAllStudents: (params) => api.get('/users/students', { params }),
  deactivateUser: (userId) => api.put(`/users/${userId}/deactivate`),
  activateUser: (userId) => api.put(`/users/${userId}/activate`),
  updateCourseProgress: (courseId, progress) => api.put(`/users/progress/${courseId}`, { progress }),
};

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

export const studentAPI = {
  getEnrolledCourses: () => api.get('/student/enrolled-courses'),
  getStats: () => api.get('/student/stats'),
  updateCourseProgress: (courseId, progress) => 
    api.put(`/student/courses/${courseId}/progress`, { progress }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getRecentActivities: () => api.get('/admin/recent-activities'),
};

export const messageAPI = {
  createMessage: (messageData) => api.post('/messages', messageData),
  getStudentMessages: (params) => api.get('/messages/student', { params }),
  getAdminMessages: (params) => api.get('/messages/admin', { params }),
  updateMessageStatus: (id, status) => api.put(`/messages/${id}/status`, { status }),
  respondToMessage: (id, response) => api.put(`/messages/${id}/respond`, { adminResponse: response }),
};

export default api;