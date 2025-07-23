import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp,
  Calendar,
  Target,
  PlayCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Users,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { userAPI, studentAPI } from '../../../utils/api';

const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCoursesCount: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Try to fetch both stats and courses, but handle failures gracefully
      const promises = [];
      
      // Add stats promise
      promises.push(
        userAPI.getDashboardStats().catch(error => {
          console.warn('Stats API failed:', error);
          return { data: { data: { stats: {
            enrolledCoursesCount: 0,
            completedCourses: 0,
            inProgressCourses: 0,
            averageProgress: 0
          }}}};
        })
      );

      // Add courses promise with fallback
      promises.push(
        studentAPI.getEnrolledCourses().catch(error => {
          console.warn('Enrolled courses API failed:', error);
          // Return mock data for development
          return { data: { data: { courses: [
            {
              courseId: {
                _id: '1',
                title: 'Basic Oromo Language',
                instructor: 'Dr. Abebe Kebede',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'
              },
              progress: 65
            },
            {
              courseId: {
                _id: '2',
                title: 'Somali Conversation',
                instructor: 'Prof. Amina Hassan',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'
              },
              progress: 30
            },
            {
              courseId: {
                _id: '3',
                title: 'Cushite Grammar Fundamentals',
                instructor: 'Dr. Mohammed Ali',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'
              },
              progress: 80
            }
          ]}}};
        })
      );

      const [statsResponse, coursesResponse] = await Promise.all(promises);

      setStats(statsResponse.data.data.stats);
      setRecentCourses(coursesResponse.data.data.courses.slice(0, 3));
      
      // Update stats based on courses if stats API failed
      if (statsResponse.data.data.stats.enrolledCoursesCount === 0 && coursesResponse.data.data.courses.length > 0) {
        const courses = coursesResponse.data.data.courses;
        const completed = courses.filter(c => c.progress >= 100).length;
        const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
        const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);
        
        setStats({
          enrolledCoursesCount: courses.length,
          completedCourses: completed,
          inProgressCourses: inProgress,
          averageProgress: avgProgress
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="text-green-100">Continue your Cushite language learning journey</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.averageProgress}%</div>
            <div className="text-green-100 text-sm">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={stats.enrolledCoursesCount}
          icon={BookOpen}
          color="blue"
          subtitle="Active learning"
        />
        <StatCard
          title="Completed"
          value={stats.completedCourses}
          icon={CheckCircle2}
          color="green"
          subtitle="Courses finished"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressCourses}
          icon={Clock}
          color="orange"
          subtitle="Currently studying"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageProgress}%`}
          icon={TrendingUp}
          color="purple"
          subtitle="Learning progress"
        />
      </div>

      {/* Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All Courses
            </button>
          </div>
          <div className="space-y-4">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <CourseProgressCard key={course.courseId._id} course={course} />
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses</h4>
                <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Learning Goals</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Set Goals
            </button>
          </div>
          <div className="space-y-4">
            <GoalItem
              title="Complete Basic Oromo Course"
              progress={75}
              deadline="2 weeks left"
              color="green"
            />
            <GoalItem
              title="Learn 100 New Words"
              progress={60}
              deadline="1 month left"
              color="blue"
            />
            <GoalItem
              title="Practice Daily for 30 Days"
              progress={23}
              deadline="7 days streak"
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Browse Courses"
            description="Explore new courses to expand your knowledge"
            icon={BookOpen}
            color="blue"
            onClick={() => window.location.href = '/student/courses'}
          />
          <QuickActionCard
            title="Practice Translation"
            description="Use our translation tool to practice"
            icon={Target}
            color="green"
            onClick={() => window.location.href = '/student/translator'}
          />
          <QuickActionCard
            title="Get Support"
            description="Need help? Contact our support team"
            icon={Users}
            color="purple"
            onClick={() => window.location.href = '/student/support'}
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const CourseProgressCard = ({ course }) => {
  const courseData = course.courseId;
  const progress = course.progress || 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'}
          alt={courseData.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{courseData.title}</h4>
          <p className="text-sm text-gray-600 truncate">{courseData.instructor}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
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
        </div>
        <button className="text-green-600 hover:text-green-700">
          <PlayCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const GoalItem = ({ title, progress, deadline, color }) => {
  const colorClasses = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500">{deadline}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right text-sm text-gray-600 mt-1">{progress}%</div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <button
      onClick={onClick}
      className="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-gray-300"
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

export default StudentOverview;