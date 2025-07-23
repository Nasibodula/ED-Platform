import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  TrendingUp,
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
  Download,
  AlertTriangle,
  X
} from 'lucide-react';
import { userAPI } from '../../../utils/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchStudents();
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: studentsPerPage,
        search: searchTerm || undefined,
      };

      const response = await userAPI.getAllStudents(params);
      const { students: fetchedStudents, pagination: paginationData } = response.data.data;
      
      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (student) => {
    try {
      if (student.isActive) {
        await userAPI.deactivateUser(student._id);
      } else {
        await userAPI.activateUser(student._id);
      }
      fetchStudents();
    } catch (error) {
      console.error('Error toggling student status:', error);
      setError('Failed to update student status.');
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleExportStudents = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Country', 'Join Date', 'Status', 'Enrolled Courses'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.country || 'N/A',
        new Date(student.createdAt).toLocaleDateString(),
        student.isActive ? 'Active' : 'Inactive',
        student.enrollmentCount || 0
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getCurrentPageStudents = () => {
    return filteredStudents;
  };

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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Student Management</h2>
            <p className="text-blue-100">Monitor and manage student accounts and progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-2xl font-bold">{pagination.totalCount || 0}</p>
              <p className="text-blue-100 text-sm">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
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
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleExportStudents}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentPageStudents().map((student) => (
                <StudentRow
                  key={student._id}
                  student={student}
                  onView={handleViewStudent}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, pagination.totalCount || 0)} of {pagination.totalCount || 0} students
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {pagination.total || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

// Student Row Component
const StudentRow = ({ student, onView, onToggleStatus }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {student.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">
              Joined {new Date(student.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.email}</div>
        <div className="text-sm text-gray-500">{student.country || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {student.enrollmentCount || 0} courses enrolled
        </div>
        <div className="text-sm text-gray-500">
          Last active: {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Never'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          student.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {student.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onView(student);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => {
                  onToggleStatus(student);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                {student.isActive ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Deactivate Student</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Activate Student</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Student Detail Modal Component (placeholder - you'll need to implement this)
const StudentDetailModal = ({ student, onClose, onToggleStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Student Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{student.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{student.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <p className="mt-1 text-sm text-gray-900">{student.country || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 text-sm text-gray-900">{student.isActive ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Joined</label>
            <p className="mt-1 text-sm text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              onToggleStatus(student);
              onClose();
            }}
            className={`px-4 py-2 text-sm text-white rounded-lg ${
              student.isActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {student.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;