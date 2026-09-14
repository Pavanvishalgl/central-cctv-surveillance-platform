import React from 'react';
import { Play, Square, Activity, Cpu } from 'lucide-react';

const AnalyticsPanel = ({ selectedCameras, cameras, analyticsStatus, onStart, onStop, loading }) => {
  const activeSelected = selectedCameras.filter(id => analyticsStatus[id]?.status === 'ACTIVE');
  const hasActive = activeSelected.length > 0;
  const canStart = selectedCameras.length > 0;
  
  const allActiveIds = Object.keys(analyticsStatus).map(Number);
  const activeCameraObjects = cameras.filter(c => allActiveIds.includes(c.id));

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg flex flex-col h-full overflow-hidden">
      <div className="p-4 bg-gray-900 border-b border-gray-700 flex-shrink-0">
        <h3 className="font-bold text-gray-100 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-purple-400" /> Analytics Control
        </h3>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">SELECTED CAMERAS</p>
            <p className="text-2xl font-bold text-gray-100">{selectedCameras.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium mb-1">STATUS</p>
            {allActiveIds.length > 0 ? (
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-xs border border-green-500/30">
                <Activity className="w-3 h-3 mr-1 animate-pulse" /> ACTIVE ({allActiveIds.length})
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-gray-700 text-gray-400 font-bold text-xs">
                INACTIVE
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <button 
            onClick={onStart}
            disabled={!canStart || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
          >
            <Play className="w-4 h-4 mr-2" /> Start Selected
          </button>
          
          <button 
            onClick={onStop}
            disabled={!hasActive || loading}
            className="w-full bg-gray-700 hover:bg-red-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
          >
            <Square className="w-4 h-4 mr-2" /> Stop Selected
          </button>
        </div>

        {activeCameraObjects.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 font-medium mb-3">PROCESSING PIPELINE</p>
            <ul className="space-y-3">
              {activeCameraObjects.map(cam => {
                const data = analyticsStatus[cam.id] || {};
                const tasks = data.tasks || [];
                const status = data.status || 'UNKNOWN';
                const detections = data.detections || [];
                const detectionCount = data.detection_count || 0;
                
                return (
                  <li key={cam.id} className="bg-gray-900 p-3 rounded border border-gray-700 text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-200 truncate">{cam.camera_name}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {status}
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-purple-400 flex flex-wrap gap-1 mb-2">
                      {tasks.map(t => <span key={t} className="bg-purple-900/50 px-1.5 py-0.5 rounded">{t.replace('_', ' ').toUpperCase()}</span>)}
                    </div>
                    
                    {status === 'ACTIVE' && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <div className="text-xs text-gray-400 mb-1 flex justify-between">
                          <span>Detections: <strong className="text-gray-200">{detectionCount}</strong></span>
                          {data.PTS !== undefined && <span>PTS: {(data.PTS / 1000).toFixed(1)}s</span>}
                        </div>
                        {detections.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto">
                            {detections.map((d, i) => (
                              <div key={i} className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-800/50">
                                <span>{d.class}</span>
                                <span className="opacity-70">{(d.confidence * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {status === 'ERROR' && (
                       <div className="mt-2 text-xs text-red-400">{data.error}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default AnalyticsPanel;
