// import React, { useState } from 'react';
// import { User, Home, Book, BookOpen, FileText, Users, HelpCircle, LogOut, Bell, Download, MessageSquare } from 'lucide-react';

// const Dashboard = () => {
//   const [userName, setUserName] = useState('Abdirahman');
  
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-indigo-950 text-white">
//         {/* Logo */}
//         <div className="flex items-center p-4 border-b border-indigo-900">
//           <h1 className="text-xl font-bold">CushiLearn</h1>
//         </div>
        
//         {/* Navigation */}
//         <nav className="mt-6">
//           <div className="px-4 mb-8">
//             <ul>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 bg-indigo-900 rounded-lg">
//                   <Home size={20} className="mr-3" />
//                   <span>HOME</span>
//                 </button>
//               </li>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
//                   <User size={20} className="mr-3" />
//                   <span>PROFILE</span>
//                 </button>
//               </li>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
//                   <BookOpen size={20} className="mr-3" />
//                   <span>MY COURSES</span>
//                 </button>
//               </li>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
//                   <FileText size={20} className="mr-3" />
//                   <span>TRANSLATION</span>
//                 </button>
//               </li>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
//                   <Users size={20} className="mr-3" />
//                   <span>COMMUNITY</span>
//                 </button>
//               </li>
//               <li className="mb-2">
//                 <button onClick={() => {}} className="flex w-full items-center p-3 hover:bg-indigo-900 rounded-lg transition-colors duration-200">
//                   <HelpCircle size={20} className="mr-3" />
//                   <span>SUPPORT</span>
//                 </button>
//               </li>
//             </ul>
//           </div>
          
//           {/* Contact */}
//           <div className="px-4 py-2 border-t border-indigo-900">
//             <div className="p-3 bg-indigo-900 bg-opacity-50 rounded-lg mb-4">
//               <div className="flex items-center mb-2">
//                 <Bell size={16} className="mr-2 text-gray-300" />
//                 <span className="text-sm text-gray-300">Help Center</span>
//               </div>
//               <button onClick={() => {}} className="text-sm block text-white">support@cushilearn.org</button>
//             </div>
            
//             <button onClick={() => {}} className="w-full flex items-center justify-center p-3 border border-white rounded-lg hover:bg-indigo-900 transition-colors duration-200">
//               <LogOut size={18} className="mr-2" />
//               <span>LOG OUT</span>
//             </button>
//           </div>
//         </nav>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-indigo-950 text-white py-6 px-8">
//           <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
//         </header>
        
//         {/* Dashboard Content */}
//         <div className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Learning Advisor */}
//             <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
//               <h2 className="text-xl font-semibold text-indigo-950 mb-4">My Language Advisor</h2>
//               <div className="flex flex-col md:flex-row">
//                 <div className="w-full md:w-1/3 mb-4 md:mb-0">
//                   <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
//                     <User size={64} className="text-gray-400" />
//                   </div>
//                 </div>
//                 <div className="w-full md:w-2/3 md:pl-6">
//                   <h3 className="text-lg font-medium text-indigo-950">Fatima Hassan</h3>
//                   <p className="text-gray-600 mt-2">+251 912 345 678</p>
//                   <p className="text-gray-600">fatima@cushilearn.org</p>
                  
//                   <button onClick={() => {}} className="mt-4 bg-indigo-950 text-white py-2 px-4 rounded flex items-center justify-center">
//                     <MessageSquare size={18} className="mr-2" />
//                     SEND MESSAGE
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             {/* Learning Progress */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-indigo-950 mb-4">My Progress</h2>
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm font-medium text-indigo-950">Oromo Basics</span>
//                     <span className="text-sm font-medium text-indigo-950">75%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm font-medium text-indigo-950">Mathematics</span>
//                     <span className="text-sm font-medium text-indigo-950">45%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm font-medium text-indigo-950">Science</span>
//                     <span className="text-sm font-medium text-indigo-950">90%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Recent Courses and App Download */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//             {/* Recent Courses */}
//             <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
//               <h2 className="text-xl font-semibold text-indigo-950 mb-4">Recently Accessed</h2>
//               <div className="space-y-4">
//                 <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                   <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                     <BookOpen size={24} className="text-indigo-950" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-indigo-950">Oromo Vocabulary</h3>
//                     <p className="text-sm text-gray-500">Last accessed: Today</p>
//                   </div>
//                   <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
//                     <Book size={16} />
//                   </button>
//                 </div>
                
//                 <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                   <div className="bg-purple-100 p-3 rounded-lg mr-4">
//                     <BookOpen size={24} className="text-purple-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-indigo-950">Basic Mathematics</h3>
//                     <p className="text-sm text-gray-500">Last accessed: Yesterday</p>
//                   </div>
//                   <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
//                     <Book size={16} />
//                   </button>
//                 </div>
                
//                 <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                   <div className="bg-blue-100 p-3 rounded-lg mr-4">
//                     <BookOpen size={24} className="text-blue-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-indigo-950">Science - Water Cycle</h3>
//                     <p className="text-sm text-gray-500">Last accessed: 3 days ago</p>
//                   </div>
//                   <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
//                     <Book size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             {/* App Download */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-indigo-950 mb-4">Download our mobile app</h2>
//               <p className="text-gray-600 mb-6">For a better offline learning experience</p>
              
//               <div className="space-y-3">
//                 <button onClick={() => {}} className="w-full flex items-center justify-center bg-black text-white rounded-lg px-4 py-2">
//                   <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-md">
//                     <span className="text-black text-xs font-bold">A</span>
//                   </div>
//                   <span>Download on App Store</span>
//                 </button>
                
//                 <button onClick={() => {}} className="w-full flex items-center justify-center bg-indigo-950 text-white rounded-lg px-4 py-2">
//                   <Download size={20} className="mr-2" />
//                   <span>Download on Play Store</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from 'react';
import { User, Book, BookOpen, MessageSquare, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [userName, setUserName] = useState('Abdirahman');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-indigo-950 text-white py-6 px-8">
          <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Learning Advisor */}
            <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
              <h2 className="text-xl font-semibold text-indigo-950 mb-4">My Language Advisor</h2>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h3 className="text-lg font-medium text-indigo-950">Fatima Hassan</h3>
                  <p className="text-gray-600 mt-2">+251 912 345 678</p>
                  <p className="text-gray-600">fatima@cushilearn.org</p>
                  
                  <button onClick={() => {}} className="mt-4 bg-indigo-950 text-white py-2 px-4 rounded flex items-center justify-center">
                    <MessageSquare size={18} className="mr-2" />
                    SEND MESSAGE
                  </button>
                </div>
              </div>
            </div>
            
            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-indigo-950 mb-4">My Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-950">Oromo Basics</span>
                    <span className="text-sm font-medium text-indigo-950">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-950">Mathematics</span>
                    <span className="text-sm font-medium text-indigo-950">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-950">Science</span>
                    <span className="text-sm font-medium text-indigo-950">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Courses and App Download */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Recent Courses */}
            <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
              <h2 className="text-xl font-semibold text-indigo-950 mb-4">Recently Accessed</h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <BookOpen size={24} className="text-indigo-950" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-950">Oromo Vocabulary</h3>
                    <p className="text-sm text-gray-500">Last accessed: Today</p>
                  </div>
                  <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
                    <Book size={16} />
                  </button>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <BookOpen size={24} className="text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-950">Basic Mathematics</h3>
                    <p className="text-sm text-gray-500">Last accessed: Yesterday</p>
                  </div>
                  <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
                    <Book size={16} />
                  </button>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <BookOpen size={24} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-950">Science - Water Cycle</h3>
                    <p className="text-sm text-gray-500">Last accessed: 3 days ago</p>
                  </div>
                  <button onClick={() => {}} className="ml-auto bg-indigo-100 text-indigo-950 p-2 rounded-full">
                    <Book size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* App Download */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-indigo-950 mb-4">Download our mobile app</h2>
              <p className="text-gray-600 mb-6">For a better offline learning experience</p>
              
              <div className="space-y-3">
                <button onClick={() => {}} className="w-full flex items-center justify-center bg-black text-white rounded-lg px-4 py-2">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-md">
                    <span className="text-black text-xs font-bold">A</span>
                  </div>
                  <span>Download on App Store</span>
                </button>
                
                <button onClick={() => {}} className="w-full flex items-center justify-center bg-indigo-950 text-white rounded-lg px-4 py-2">
                  <Download size={20} className="mr-2" />
                  <span>Download on Play Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

