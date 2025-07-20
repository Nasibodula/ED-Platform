import React ,{ useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function Hero() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Simulate audio duration for demo
    useEffect(() => {
        setDuration(180); 
    }, []);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleProgressClick = (e) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const newTime = percentage * duration;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Simulate time progress when playing
    useEffect(() => {
        let interval = null;
        if (isPlaying && currentTime < duration) {
        interval = setInterval(() => {
            setCurrentTime(currentTime => currentTime + 1);
        }, 1000);
        } else if (currentTime >= duration) {
        setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, duration]);
  return (
    <div className="background min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="px-8 py-16 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className=" space-y-8">
            <div className="text-teal-600 inline-block bg-white  px-4 py-2 rounded-full text-sm font-medium">
              ENHANCE YOUR CAREER
            </div>
            
            <h1 className="text-white text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Education with CushLearn 
            </h1>
            
            <p className="text-white text-lg opacity-90 max-w-md">
                Innovative learning platform for Cushitic language communities.
                Bridging knowledge gaps through accessible, multilingual education.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
                Get started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all">
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="flex -space-x-2">
                <div className="">
                  <img className='w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center' src='/assets/images/profile3.jpg' alt='img missing'/>
                </div>
                <div className="">
                  <img className='w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center' src='/assets/images/profile4.jpg' alt='img missing'/>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">100K+</span>
                </div>
              </div>
              <div className="text-white">
                <div className="font-bold">50,000+ Learners</div>
                <div className="text-sm opacity-80">Join our community</div>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
            <div className="relative h-96 lg:h-[500px]">
                    {/* Main Card - Woman with laptop */}
                <div className="w-64 h-80 top-20 bg-white bg-opacity-30 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
                    <img  className="absolute inset-0 h-full w-full object-cover rounded-2xl" 
                        src=" assets/images/profile5.png"
                        alt="profile" />
                    
                    {/* Audio Player at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm rounded-b-2xl p-3">
                        <div className="mb-3">
                        <h2 className="text-sm font-semibold text-teal-600">English-Oromo</h2>
                        <p className="text-xs text-gray-500 mt-1">4months</p>
                        </div>
                    {/* Progress Bar */}
                    <div className="mb-2">
                    <div  className="w-full h-1 bg-gray-200 rounded-full cursor-pointer relative"
                        onClick={handleProgressClick}>
                        <div className="h-full bg-teal-600 rounded-full relative"
                        style={{ width: `${progressPercentage}%` }} >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-teal-600 rounded-full shadow-md"></div>
                        </div>
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>10:20:30</span>
                        <span>20 min</span>
                    </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <SkipBack size={16} className="text-gray-600" />
                    </button> 
                    <button onClick={togglePlayPause} className="p-2 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors">
                        {isPlaying ? (
                        <Pause size={18} className="text-white" />
                        ) : (
                        <Play size={18} className="text-white ml-0.5" />
                        )}
                    </button>     
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <SkipForward size={16} className="text-gray-600" />
                    </button>
                    </div>
                </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute top-8 right-0 w-48 h-56  rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img className='h-full rounded-2xl' src='/assets/images/profile7.jpg' alt='profile6'/>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-0 right-12 w-44 h-52 bg-white rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img className='h-full rounded-2xl' src='/assets/images/profile6.jpg' alt='profile7'/>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-16 left-0 w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-4 w-2 h-2 bg-white bg-opacity-40 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-32 right-8 w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-lg"></div>
    </div>
  );
}

