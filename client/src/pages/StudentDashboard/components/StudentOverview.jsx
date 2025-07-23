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
  Star
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    totalHoursLearned: 0,
    currentStreak: 0,
    profileCompleteness: 75
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        enrolledCourses: 5,
        completedCourses: 2,
        inProgressCourses: 3,
        averageProgress: 68,
        totalHoursLearned: 24,
        currentStreak: 7,
        profileCompleteness: 85
      });

      setRecentCourses([
        {
          id: 1,
          title: 'Basic Oromo Language',
          progress: 75,
          instructor: 'Obbo Gammachuu',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
          lastAccessed: '2 hours ago',
          nextLesson: 'Grammar Basics'
        },
        {
          id: 2,
          title: 'Somali Conversation',
          progress: 45,
          instructor: 'Ust. Cali Maxamed',
          thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
          lastAccessed: '1 day ago',
          nextLesson: 'Daily Phrases'
        },
        {
          id: 3,
          title: 'Cultural Studies',
          progress: 90,
          instructor: 'Dr. Fatima Hassan',
          thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
          lastAccessed: '3 hours ago',
          nextLesson: 'Final Assessment'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, progress }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{progress}%</div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 truncate">{course.title}</h4>
          <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{course.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last: {course.lastAccessed}</span>
            <span className="text-blue-600 font-medium">Next: {course.nextLesson}</span>
          </div>
        </div>
        
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <PlayCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-green-100">
              Ready to continue your Cushitic language learning journey?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm text-green-100">Day Streak</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <PlayCircle className="w-4 h-4" />
            <span>Continue Learning</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Browse Courses</span>
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          subtitle="Active learning paths"
          color="bg-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          title="Completed Courses"
          value={stats.completedCourses}
          subtitle="Certificates earned"
          color="bg-green-600"
        />
        <StatCard
          icon={Clock}
          title="Hours Learned"
          value={`${stats.totalHoursLearned}h`}
          subtitle="Total study time"
          color="bg-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          subtitle="Across all courses"
          color="bg-orange-600"
          progress={stats.averageProgress}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
              <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            {recentCourses.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
                  <span className="text-sm text-gray-600">5/7 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Hours</span>
                  <span className="text-sm text-gray-600">18/25 hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm">
              Update Goals
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Complete</span>
                <span className="text-sm font-medium text-green-600">{stats.profileCompleteness}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="text-sm font-medium text-orange-600">{stats.currentStreak} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Courses in Progress</span>
                <span className="text-sm font-medium text-blue-600">{stats.inProgressCourses}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">First Course Completed</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">7-Day Streak</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Profile 85% Complete</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;