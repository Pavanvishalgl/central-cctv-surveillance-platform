import React from 'react';

const Header = () => {
  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-100">Command Center</h2>
      <div className="flex items-center space-x-4">
        <span className="flex items-center text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          System Online
        </span>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow">
          AD
        </div>
      </div>
    </header>
  );
};
export default Header;
