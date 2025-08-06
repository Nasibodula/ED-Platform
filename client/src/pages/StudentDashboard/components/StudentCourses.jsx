import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  PlayCircle,
  CheckCircle2,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Star,
  Users,
  Calendar,
  Target,
  TrendingUp,
  X,
  AlertTriangle
} from 'lucide-react';
import { studentAPI, courseAPI, userAPI } from '../../../utils/api';

const StudentCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('enrolled'); 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterStatus, enrolledCourses, availableCourses, activeTab]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'enrolled') {
        const response = await studentAPI.getEnrolledCourses();
        setEnrolledCourses(response.data.data.courses);
      } else {
        // Fetch all available courses that are published
        const response = await courseAPI.getAllCourses({ 
          page: 1, 
          limit: 50,
          isPublished: true 
        });
        
        // Get enrolled course IDs
        const enrolledResponse = await studentAPI.getEnrolledCourses();
        const enrolledCourseIds = enrolledResponse.data.data.courses.map(
          enrollment => enrollment.courseId._id
        );
        
        // Filter out already enrolled courses
        const availableCoursesFiltered = response.data.data.courses.filter(
          course => !enrolledCourseIds.includes(course._id)
        );
        
        setAvailableCourses(availableCoursesFiltered);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchCourses function to properly handle available courses


  const filterCourses = () => {
    const courses = activeTab === 'enrolled' ? enrolledCourses : availableCourses;
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => {
        const courseData = activeTab === 'enrolled' ? course.courseId : course;
        return courseData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               courseData.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
               courseData.category.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterStatus !== 'all' && activeTab === 'enrolled') {
      filtered = filtered.filter(course => {
        if (filterStatus === 'completed') return course.progress === 100;
        if (filterStatus === 'in-progress') return course.progress > 0 && course.progress < 100;
        if (filterStatus === 'not-started') return course.progress === 0;
        return true;
      });
    }

    setFilteredCourses(filtered);
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      await courseAPI.enrollInCourse(courseId);
      setShowEnrollModal(false);
      setSelectedCourse(null);
      
      // Refresh enrolled courses if we're on the enrolled tab
      if (activeTab === 'enrolled') {
        fetchCourses();
      }
      
      // Show success message
      setError('');
      alert('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
      setError(errorMessage);
    }
  };

  const handleUpdateProgress = async (courseId, newProgress) => {
    try {
      await userAPI.updateCourseProgress(courseId, newProgress);
      fetchCourses(); // Refresh courses to show updated progress
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading && filteredCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-1 text-sm text-red-800 underline hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Courses</h2>
            <p className="text-green-100">Track your learning progress and discover new courses</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{enrolledCourses.length}</div>
            <div className="text-green-100 text-sm">Enrolled Courses</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'enrolled'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Enrolled Courses ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Courses
            </button>
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'enrolled' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Courses</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="not-started">Not Started</option>
                </select>
              )}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-50 text-green-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredCourses.map((course) => (
          activeTab === 'enrolled' ? (
            <EnrolledCourseCard
              key={course.courseId._id}
              course={course}
              viewMode={viewMode}
              onUpdateProgress={handleUpdateProgress}
            />
          ) : (
            <AvailableCourseCard
              key={course._id}
              course={course}
              viewMode={viewMode}
              onEnroll={() => {
                setSelectedCourse(course);
                setShowEnrollModal(true);
              }}
            />
          )
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'enrolled' ? 'No enrolled courses' : 'No courses available'}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'enrolled' 
              ? 'Start your learning journey by enrolling in a course'
              : 'Check back later for new courses'
            }
          </p>
          {activeTab === 'enrolled' && (
            <button
              onClick={() => setActiveTab('available')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Available Courses
            </button>
          )}
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && (
        <EnrollModal
          course={selectedCourse}
          onClose={() => {
            setShowEnrollModal(false);
            setSelectedCourse(null);
          }}
          onEnroll={() => handleEnrollInCourse(selectedCourse._id)}
        />
      )}
    </div>
  );
};

// Enrolled Course Card Component
const EnrolledCourseCard = ({ course, viewMode, onUpdateProgress }) => {
  const courseData = course.courseId;
  const progress = course.progress || 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'}
            alt={courseData.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{courseData.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{courseData.instructor}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{courseData.level}</span>
                  <span className="mx-2">•</span>
                  <span>{courseData.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{progress}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onUpdateProgress(courseData._id, Math.min(progress + 10, 100))}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
          alt={courseData.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            progress === 100 
              ? 'bg-green-100 text-green-700' 
              : progress > 0 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{courseData.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{courseData.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4">
            <Users className="w-4 h-4 mr-1" />
            {courseData.enrolledStudents?.length || 0}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {courseData.duration}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          onClick={() => onUpdateProgress(courseData._id, Math.min(progress + 10, 100))}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{progress === 0 ? 'Start Course' : 'Continue Learning'}</span>
        </button>
      </div>
    </div>
  );
};

// Available Course Card Component
const AvailableCourseCard = ({ course, viewMode, onEnroll }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'}
            alt={course.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{course.level}</span>
                  <span className="mx-2">•</span>
                  <span>{course.category}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {course.enrolledStudents?.length || 0}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                {course.averageRating && (
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.averageRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEnroll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enroll Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {course.isPremium && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full">
              Premium
            </span>
          </div>
        )}
        {course.averageRating && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{course.averageRating}</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4">
            <Users className="w-4 h-4 mr-1" />
            {course.enrolledStudents?.length || 0} students
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
            <p className="text-xs text-gray-500">{course.category} • {course.level}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </p>
          </div>
        </div>
        
        <button
          onClick={onEnroll}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll Now</span>
        </button>
      </div>
    </div>
  );
};

// Enroll Modal Component
const EnrollModal = ({ course, onClose, onEnroll }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Enroll in Course</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'}
              alt={course.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.instructor}</p>
              <p className="text-sm text-gray-500">{course.level} • {course.duration}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-sm font-medium text-gray-900">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Students Enrolled:</span>
              <span className="text-sm font-medium text-gray-900">
                {course.enrolledStudents?.length || 0}
              </span>
            </div>
            {course.averageRating && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {course.averageRating}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onEnroll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
