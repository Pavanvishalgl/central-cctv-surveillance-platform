import React, { useState, useEffect } from 'react';
import { getVMSCameras } from '../../services/api';
import { X, AlertTriangle, Video } from 'lucide-react';

const FederatedCamerasModal = ({ vms, onClose }) => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await getVMSCameras(vms.vms_id);
        setCameras(data);
      } catch (err) {
        setError("Failed to fetch federated cameras. Check VMS connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, [vms.vms_id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-xl font-bold text-gray-100 flex items-center">
            <Video className="w-5 h-5 mr-3 text-indigo-400" /> 
            {vms.name} - Federated Cameras
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-gray-400 text-center py-8">Fetching cameras from VMS...</div>
          ) : error ? (
            <div className="text-red-400 text-center py-8 flex flex-col items-center">
              <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
              {error}
            </div>
          ) : cameras.length === 0 ? (
            <div className="text-gray-400 text-center py-8 border border-dashed border-gray-700 rounded-lg">
              No cameras found on this VMS.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Protocol</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cameras.map(cam => (
                    <tr key={cam.camera_code} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-mono text-gray-300 text-xs">{cam.camera_code}</td>
                      <td className="px-4 py-3 text-gray-200">{cam.camera_name}</td>
                      <td className="px-4 py-3">{cam.location_name}</td>
                      <td className="px-4 py-3">{cam.protocol}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${cam.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {cam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FederatedCamerasModal;
