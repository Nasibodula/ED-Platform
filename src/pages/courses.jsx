import React, { useState } from 'react';
import { Play, Clock, Users, BookOpen, ChevronRight, Globe, Star, ArrowLeft } from 'lucide-react';
import { translations, getCoursesByLanguage, getCourseById, getYouTubeVideoId } from '../data/courses.js';

const CoursesSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState('oromo');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState('courses'); // 'courses' or 'lessons'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);

  const t = translations[currentLanguage];
  const courses = getCoursesByLanguage(currentLanguage);

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleStartCourse = (courseId) => {
    const course = getCourseById(courseId, currentLanguage);
    setSelectedCourse(course);
    setCurrentVideo(course.videos[0]); // Start with first video
    setCurrentView('lessons');
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourse(null);
    setCurrentVideo(null);
  };

  const CategoryButton = ({ category, label }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
        selectedCategory === category
          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Play className="w-16 h-16 text-white" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {t.levels[course.level]}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm">
          {course.description}
        </p>
        
        <p className="text-sm text-blue-600 mb-4 font-medium">
          {course.instructor}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration} {currentLanguage === 'oromo' ? 'torban' : 'usbuuc'}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.lessons}
          </span>
        </div>
        
        <button 
          onClick={() => handleStartCourse(course.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          {t.courseDetails.startCourse}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const VideoPlayer = ({ video }) => {
    const videoId = getYouTubeVideoId(video.youtubeUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={video.title}
          className="w-full h-64 md:h-80"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  const VideoListItem = ({ video, isActive, onClick }) => (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isActive ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
          <Play className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
            {video.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1">{video.duration}</p>
          <p className="text-xs text-gray-500 mt-1">{video.description}</p>
        </div>
      </div>
    </div>
  );

  const LessonsView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleBackToCourses}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.courseDetails.backToCourses}
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">{selectedCourse?.title}</h1>
        <p className="text-gray-600 mt-2">{selectedCourse?.instructor}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          {currentVideo && (
            <div>
              <VideoPlayer video={currentVideo} />
              <div className="mt-4 p-4 bg-white rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
                <p className="text-gray-600">{currentVideo.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Video List - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t.courseDetails.courseContent}</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedCourse?.videos.map((video) => (
              <VideoListItem
                key={video.id}
                video={video}
                isActive={currentVideo?.id === video.id}
                onClick={() => setCurrentVideo(video)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CoursesView = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {Object.entries(t.categories).map(([key, label]) => (
          <CategoryButton key={key} category={key} label={label} />
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {courses.length}+
            </div>
            <div className="text-gray-600">
              {currentLanguage === 'oromo' ? 'Barnoota' : 'Koorsas'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">8K+</div>
            <div className="text-gray-600">
              {currentLanguage === 'oromo' ? 'Barattoota' : 'Ardayda'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">8+</div>
            <div className="text-gray-600">
              {currentLanguage === 'oromo' ? 'Barsiisota' : 'Macallimiinta'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-gray-600">
              {currentLanguage === 'oromo' ? 'Itti Quufinsa' : 'Qancinta'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Language Toggle */}
      <div className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Cushite Education</h1>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => {
                  setCurrentLanguage('oromo');
                  if (currentView === 'lessons') handleBackToCourses();
                }}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  currentLanguage === 'oromo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Afaan Oromoo
              </button>
              <button
                onClick={() => {
                  setCurrentLanguage('somali');
                  if (currentView === 'lessons') handleBackToCourses();
                }}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  currentLanguage === 'somali'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Af-Soomaali
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering */}
      {currentView === 'courses' ? <CoursesView /> : <LessonsView />}
    </div>
  );
};

export default CoursesSection;