import React from 'react';
import { CheckSquare, Square, Activity } from 'lucide-react';

const CameraTile = ({ camera, isSelected, toggleSelection, onPreview, analyticsData }) => {
  const isAnalyzing = !!analyticsData;

  return (
    <div 
      className={`bg-gray-800 border rounded-lg p-4 cursor-pointer transition-colors flex flex-col ${isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-500'}`}
      onClick={() => onPreview(camera)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleSelection(camera.id); }}
            className="text-gray-400 hover:text-white"
          >
            {isSelected ? <CheckSquare className="w-5 h-5 text-blue-500" /> : <Square className="w-5 h-5" />}
          </button>
          <h3 className="font-bold text-gray-100 truncate max-w-[150px]">{camera.camera_name}</h3>
        </div>
        {isAnalyzing && (
          <span className="flex items-center text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
            <Activity className="w-3 h-3 mr-1 animate-pulse" /> ACTIVE
          </span>
        )}
      </div>
      <div className="text-sm text-gray-400 space-y-1 ml-8">
        <p className="font-mono text-xs">{camera.camera_code}</p>
        <p className="truncate">Loc: {camera.location_name}</p>
        <p className="truncate">Dept: {camera.department}</p>
        <div className="flex space-x-2 mt-3">
          <span className={`px-2 py-0.5 rounded text-[10px] text-white ${camera.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}>
            {camera.status}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-700 text-gray-300">
            {camera.protocol}
          </span>
        </div>
      </div>
    </div>
  );
};
export default CameraTile;
