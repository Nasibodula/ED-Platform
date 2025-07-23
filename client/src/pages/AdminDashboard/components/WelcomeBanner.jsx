import React from 'react';

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
      <p className="text-blue-100">
        Manage your Cushite learning platform efficiently. Monitor student progress, 
        add new courses, and respond to student requests.
      </p>
    </div>
  );
};

export default WelcomeBanner;