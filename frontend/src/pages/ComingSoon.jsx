import React from 'react';

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="p-4 bg-gray-800 rounded-full mb-4 border border-gray-700">
        <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-200 mb-2">Coming Soon</h2>
      <p className="text-gray-400 max-w-md">
        This module is currently under development. It will be available in upcoming phases of the Gujarat CCTV Intelligence Platform.
      </p>
    </div>
  );
};
export default ComingSoon;
