import React from 'react';
import { X, Radio, AlertCircle, Video } from 'lucide-react';

import { API_URL } from '../../services/api';

const StreamPreview = ({ camera, onClose, analyticsData }) => {
  if (!camera) return null;

  const isOffline = camera.status !== 'ACTIVE';
  const streamStatus = analyticsData?.status;
  const isStreamActive = streamStatus === 'ACTIVE';
  const isConnecting = streamStatus === 'CONNECTING' || streamStatus === 'STARTING';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg flex flex-col overflow-hidden h-full">
      <div className="p-3 bg-gray-900 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-gray-100 flex items-center text-sm truncate">
          <Radio className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" /> Preview: {camera.camera_name}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-2 flex-shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 bg-black relative flex items-center justify-center p-4">
        {isOffline ? (
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold tracking-widest text-sm">STREAM UNAVAILABLE</p>
            <p className="text-xs text-gray-500 mt-1">Camera is offline</p>
          </div>
        ) : isStreamActive ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden relative">
            <img 
              key={`stream-${camera.id}`} 
              src={`${API_URL || "http://localhost:8000"}/api/analytics/stream/${camera.id}`} 
              alt={`Live stream for ${camera.camera_name}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : isConnecting ? (
          <div className="text-center text-yellow-400 w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-900/50 p-2">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="font-bold text-sm tracking-widest">CONNECTING...</p>
            <p className="text-[10px] text-gray-500 mt-2">Establishing secure stream</p>
          </div>
        ) : (
          <div className="text-center text-gray-400 w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-900/50 p-2">
            <Video className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-bold text-lg text-gray-300 tracking-widest">STREAM INACTIVE</p>
            <p className="text-[10px] text-gray-500 mt-4">Start analytics to view.</p>
          </div>
        )}
        
        {isStreamActive && (
          <div className="absolute top-4 right-4 flex items-center bg-black/50 px-2 py-1 rounded z-10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-[10px] font-bold text-gray-200">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default StreamPreview;
