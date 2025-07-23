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
  X
} from 'lucide-react';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, in-progress, completed, not-started
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchAvailableCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterStatus, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCourses = [
        {
          id: 1,
          title: 'Basic Oromo Language',
          instructor: 'Obbo Gammachuu Tasfaayee',
          progress: 75,
          category: 'Language',
          level: 'Beginner',
          duration: '8 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
          enrolledAt: '2024-01-15',
          lastAccessed: '2024-01-20',
          totalLessons: 24,
          completedLessons: 18,
          nextLesson: 'Grammar Fundamentals',
          status: 'in-progress',
          rating: 4.8,
          studentsEnrolled: 1234
        },
        {
          id: 2,
          title: 'Somali Conversation Skills',
          instructor: 'Ust. Cali Maxamed',
          progress: 100,
          category: 'Conversation',
          level: 'Intermediate',
          duration: '6 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
          enrolledAt: '2023-12-01',
          lastAccessed: '2024-01-10',
          totalLessons: 18,
          completedLessons: 18,
          nextLesson: 'Course Completed',
          status: 'completed',
          rating: 4.9,
          studentsEnrolled: 856,
          completedAt: '2024-01-10',
          certificate: true
        },
        {
          id: 3,
          title: 'Cultural Studies: Horn of Africa',
          instructor: 'Dr. Fatima Hassan',
          progress: 45,
          category: 'Culture',
          level: 'Advanced',
          duration: '10 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
          enrolledAt: '2024-01-10',
          lastAccessed: '2024-01-19',
          totalLessons: 30,
          completedLessons: 13,
          nextLesson: 'Traditional Practices',
          status: 'in-progress',
          rating: 4.7,
          studentsEnrolled: 445
        },
        {
          id: 4,
          title: 'Borana Basics',
          instructor: 'Sheikh Ahmed Ali',
          progress: 0,
          category: 'Language',
          level: 'Beginner',
          duration: '4 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          enrolledAt: '2024-01-20',
          lastAccessed: null,
          totalLessons: 16,
          completedLessons: 0,
          nextLesson: 'Introduction to Borana',
          status: 'not-started',
          rating: 4.6,
          studentsEnrolled: 203
        }
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      // Mock available courses for enrollment
      const mockAvailable = [
        {
          id: 5,
          title: 'Advanced Grammar Structures',
          instructor: 'Prof. Meron Tadesse',
          category: 'Grammar',
          level: 'Advanced',
          duration: '6 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
          rating: 4.8,
          studentsEnrolled: 567,
          description: 'Master complex grammar patterns in Cushitic languages'
        },
        {
          id: 6,
          title: 'Business Communication',
          instructor: 'Mr. Hassan Omar',
          category: 'Professional',
          level: 'Intermediate',
          duration: '8 weeks',
          thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
          rating: 4.5,
          studentsEnrolled: 234,
          description: 'Professional language skills for business contexts'
        }
      ];
      
      setAvailableCourses(mockAvailable);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => course.status === filterStatus);
    }

    setFilteredCourses(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'not-started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return status;
    }
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
            {getStatusText(course.status)}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{course.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-600">by {course.instructor}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center space-x-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.totalLessons} lessons</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{course.studentsEnrolled}</span>
          </span>
        </div>

        {course.status !== 'not-started' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {course.completedLessons} of {course.totalLessons} lessons completed
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {course.lastAccessed ? (
              <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
            ) : (
              <span>Not started yet</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {course.status === 'completed' && course.certificate && (
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
                Certificate
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
              {course.status === 'completed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Continue</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseListItem = ({ course }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.totalLessons} lessons</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
              </div>
              
              {course.status !== 'not-started' && (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {course.lastAccessed ? `Last: ${new Date(course.lastAccessed).toLocaleDateString()}` : 'Not started'}
                </div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                {course.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Review</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <p className="text-gray-600 mt-1">Track your progress and continue learning</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll in Course</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter(c => c.status === 'in-progress').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You haven\'t enrolled in any courses yet'
            }
          </p>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredCourses.map(course => 
            viewMode === 'grid' 
              ? <CourseCard key={course.id} course={course} />
              : <CourseListItem key={course.id} course={course} />
          )}
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Available Courses</h3>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                    <p className="text-sm text-gray-700 mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.level}</span>
                      <span>{course.duration}</span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </span>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;