import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Users,
  BookOpen,
  Clock,
  Star,
  MoreVertical,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { courseAPI } from '../../../utils/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [error, setError] = useState('');

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'Basic Cushite',
    level: 'Beginner',
    language: 'Mixed',
    duration: '',
    price: 0,
    isPremium: false,
    isPublished: false,
    tags: [],
    requirements: [],
    learningObjectives: [],
    lessons: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterStatus, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await courseAPI.getAdminCourses();
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => 
        filterStatus === 'published' ? course.isPublished : !course.isPublished
      );
    }

    setFilteredCourses(filtered);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.createCourse(newCourse);
      setShowCreateModal(false);
      setNewCourse({
        title: '',
        description: '',
        instructor: '',
        category: 'Basic Cushite',
        level: 'Beginner',
        language: 'Mixed',
        duration: '',
        price: 0,
        isPremium: false,
        isPublished: false,
        tags: [],
        requirements: [],
        learningObjectives: [],
        lessons: []
      });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.updateCourse(selectedCourse._id, selectedCourse);
      setShowEditModal(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course. Please try again.');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await courseAPI.deleteCourse(courseToDelete._id);
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await courseAPI.updateCourse(course._id, { 
        ...course, 
        isPublished: !course.isPublished 
      });
      fetchCourses();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError('Failed to update course status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Course Management</h2>
            <p className="text-purple-100">Create, edit, and manage courses for your students</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={(course) => {
              setSelectedCourse(course);
              setShowEditModal(true);
            }}
            onDelete={(course) => {
              setCourseToDelete(course);
              setShowDeleteConfirm(true);
            }}
            onTogglePublish={handleTogglePublish}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first course.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Course
            </button>
          )}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <CourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          course={newCourse}
          setCourse={setNewCourse}
          onSubmit={handleCreateCourse}
          title="Create New Course"
          submitText="Create Course"
        />
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <CourseModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          setCourse={setSelectedCourse}
          onSubmit={handleEditCourse}
          title="Edit Course"
          submitText="Update Course"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setCourseToDelete(null);
          }}
          onConfirm={handleDeleteCourse}
          courseName={courseToDelete?.title}
        />
      )}
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onEdit, onDelete, onTogglePublish }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    onEdit(course);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onTogglePublish(course);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{course.isPublished ? 'Unpublish' : 'Publish'}</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(course);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            course.isPublished 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center mr-4">
            <Users className="w-4 h-4 mr-1" />
            {course.enrolledStudents?.length || 0} students
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
            <p className="text-xs text-gray-500">{course.category} • {course.level}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </p>
            {course.isPremium && (
              <span className="text-xs text-purple-600 font-medium">Premium</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Modal Component
const CourseModal = ({ isOpen, onClose, course, setCourse, onSubmit, title, submitText }) => {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setCourse(prev => ({ ...prev, [field]: items }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor *
              </label>
              <input
                type="text"
                value={course.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={course.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={course.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Basic Cushite">Basic Cushite</option>
                <option value="Intermediate Cushite">Intermediate Cushite</option>
                <option value="Advanced Cushite">Advanced Cushite</option>
                <option value="Culture">Culture</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
                <option value="Conversation">Conversation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={course.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={course.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Oromo">Oromo</option>
                <option value="Somali">Somali</option>
                <option value="Borana">Borana</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={course.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 8 weeks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={course.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={course.tags?.join(', ') || ''}
              onChange={(e) => handleArrayChange('tags', e.target.value)}
              placeholder="e.g., beginner, oromo, grammar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements (comma-separated)
            </label>
            <input
              type="text"
              value={course.requirements?.join(', ') || ''}
              onChange={(e) => handleArrayChange('requirements', e.target.value)}
              placeholder="e.g., No prior knowledge required, Internet access"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Objectives (comma-separated)
            </label>
            <input
              type="text"
              value={course.learningObjectives?.join(', ') || ''}
              onChange={(e) => handleArrayChange('learningObjectives', e.target.value)}
              placeholder="e.g., Understand basic vocabulary, Form simple sentences"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={course.isPremium}
                onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Premium Course</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={course.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Published</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, courseName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Delete Course
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete "{courseName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;