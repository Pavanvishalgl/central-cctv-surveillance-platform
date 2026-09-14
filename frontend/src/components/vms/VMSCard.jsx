import React from 'react';
import { Server, CheckCircle, XCircle, Video, Play, Square } from 'lucide-react';

const VMSCard = ({ vms, onConnect, onDisconnect, onViewCameras }) => {
  return (
    <div className={`bg-gray-800 border rounded-lg p-5 flex flex-col ${vms.connected ? 'border-green-500/50' : 'border-gray-700'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${vms.connected ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-lg">{vms.name}</h3>
            <p className="text-xs text-gray-400 font-mono">ID: {vms.vms_id.split('-')[0]}...</p>
          </div>
        </div>
        <div>
          {vms.connected ? (
            <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
              <CheckCircle className="w-3 h-3 mr-1" /> ONLINE
            </span>
          ) : (
            <span className="flex items-center text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
              <XCircle className="w-3 h-3 mr-1" /> OFFLINE
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-6 flex-1">
        <p className="text-sm text-gray-300"><span className="text-gray-500">Vendor:</span> {vms.vendor}</p>
        <p className="text-sm text-gray-300"><span className="text-gray-500">Host:</span> {vms.host}</p>
      </div>

      <div className="pt-4 border-t border-gray-700 space-y-2">
        {vms.connected ? (
          <>
            <button 
              onClick={onViewCameras}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium py-2 px-4 rounded flex items-center justify-center transition-colors text-sm"
            >
              <Video className="w-4 h-4 mr-2" /> View Cameras
            </button>
            <button 
              onClick={onDisconnect}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded flex items-center justify-center transition-colors text-sm"
            >
              <Square className="w-4 h-4 mr-2" /> Disconnect
            </button>
          </>
        ) : (
          <button 
            onClick={onConnect}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center transition-colors text-sm"
          >
            <Play className="w-4 h-4 mr-2" /> Connect Node
          </button>
        )}
      </div>
    </div>
  );
};
export default VMSCard;
