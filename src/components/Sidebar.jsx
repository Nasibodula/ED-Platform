import React from 'react';
import { User, Home, Book, BookOpen, FileText, Users, HelpCircle, LogOut, Bell, ChevronLeft, ChevronRight} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed h-screen bg-indigo-950 text-white z-10`}>
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-4 top-20 bg-indigo-950 text-white p-2 rounded-full shadow-md"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {/* Logo */}
      <div className="flex items-center p-4 border-b border-indigo-900">
        {isOpen ? (
          <h1 className="text-xl font-bold">CushiLearn</h1>
        ) : (
          <h1 className="text-xl font-bold">CL</h1>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-4 mb-8">
          <ul>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 bg-indigo-900 rounded-lg">
                <Home size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>HOME</span>}
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
                <User size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>PROFILE</span>}
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
                <BookOpen size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>MY COURSES</span>}
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
                <FileText size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>TRANSLATION</span>}
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
                <Users size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>COMMUNITY</span>}
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
                <HelpCircle size={20} className={isOpen ? "mr-3" : "mx-auto"} />
                {isOpen && <span>SUPPORT</span>}
              </button>
            </li>
          </ul>
        </div>
        
        {/* Contact */}
        {isOpen && (
          <div className="px-4 py-2 border-t border-indigo-900">
            <div className="p-3 bg-indigo-900 bg-opacity-50 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <Bell size={16} className="mr-2 text-gray-300" />
                <span className="text-sm text-gray-300">Help Center</span>
              </div>
              <button onClick={() => {}} className="text-sm block text-white">support@cushilearn.org</button>
            </div>
            <Link to='/'>
            <button onClick={() => {}} className="w-full flex items-center justify-center p-3 border border-white rounded-lg hover:bg-indigo-900 transition-colors duration-200">
              <LogOut size={18} className="mr-2" />
              <span>LOG OUT</span>
            </button>
            </Link>
          </div>
        )}
        
        {/* Minimized Logout */}
        {!isOpen && (
          <div className="px-4 py-2 border-t border-indigo-900">
            <button onClick={() => {}} className="w-full flex items-center justify-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;