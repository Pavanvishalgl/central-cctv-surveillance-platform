import React, { useState, useEffect } from 'react';
import { getVMSList, connectVMS, disconnectVMS, getVMSCameras } from '../services/api';
import VMSCard from '../components/vms/VMSCard';
import VMSModal from '../components/vms/VMSModal';
import FederatedCamerasModal from '../components/vms/FederatedCamerasModal';
import { Network, Plus, AlertTriangle } from 'lucide-react';

const VMSFederation = () => {
  const [vmsList, setVmsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [camerasModalVms, setCamerasModalVms] = useState(null);

  const fetchVMSList = async () => {
    try {
      setLoading(true);
      const data = await getVMSList();
      setVmsList(data);
      setError(null);
    } catch (err) {
      setError("Failed to load VMS sources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVMSList();
  }, []);

  const handleConnect = async (id) => {
    try {
      await connectVMS(id);
      fetchVMSList();
    } catch (err) {
      alert("Failed to connect VMS.");
    }
  };

  const handleDisconnect = async (id) => {
    try {
      await disconnectVMS(id);
      fetchVMSList();
    } catch (err) {
      alert("Failed to disconnect VMS.");
    }
  };

  const handleViewCameras = (vms) => {
    setCamerasModalVms(vms);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center">
          <Network className="mr-3 w-6 h-6 text-indigo-400" /> VMS Federation Layer
        </h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Register VMS Source
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-gray-400 text-center py-10">Loading VMS sources...</div>
        ) : error ? (
          <div className="text-red-400 p-6 flex justify-center items-center"><AlertTriangle className="mr-2"/> {error}</div>
        ) : vmsList.length === 0 ? (
          <div className="text-gray-500 text-center py-10 border border-dashed border-gray-700 rounded-lg">
            No VMS sources registered. Click "Register VMS Source" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vmsList.map(vms => (
              <VMSCard 
                key={vms.vms_id} 
                vms={vms} 
                onConnect={() => handleConnect(vms.vms_id)}
                onDisconnect={() => handleDisconnect(vms.vms_id)}
                onViewCameras={() => handleViewCameras(vms)}
              />
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <VMSModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => { setIsAddModalOpen(false); fetchVMSList(); }} 
        />
      )}

      {camerasModalVms && (
        <FederatedCamerasModal 
          vms={camerasModalVms} 
          onClose={() => setCamerasModalVms(null)} 
        />
      )}
    </div>
  );
};
export default VMSFederation;
