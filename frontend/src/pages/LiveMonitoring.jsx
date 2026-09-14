import React, { useState, useEffect } from 'react';
import { getCameras, getAnalyticsStatus, startAnalytics, stopAnalytics } from '../services/api';
import CameraTile from '../components/monitoring/CameraTile';
import StreamPreview from '../components/monitoring/StreamPreview';
import AnalyticsPanel from '../components/monitoring/AnalyticsPanel';
import { MonitorPlay, AlertTriangle } from 'lucide-react';

const LiveMonitoring = () => {
  const [cameras, setCameras] = useState([]);
  const [analyticsStatus, setAnalyticsStatus] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewCamera, setPreviewCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [cams, status] = await Promise.all([getCameras(), getAnalyticsStatus()]);
      setCameras(cams);
      setAnalyticsStatus(status);
    } catch (err) {
      console.error("API Error in fetchData:", err);
      setError("Failed to load monitoring data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll for live analytics status
    const interval = setInterval(async () => {
      try {
        const status = await getAnalyticsStatus();
        setAnalyticsStatus(status);
      } catch (err) {
        console.error("Failed to poll status", err);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => setSelectedIds(cameras.map(c => c.id));
  const handleClear = () => setSelectedIds([]);

  const handleStartAnalytics = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await startAnalytics(selectedIds);
      await fetchData();
    } catch (err) {
      alert("Error starting analytics");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopAnalytics = async () => {
    const activeSelected = selectedIds.filter(id => analyticsStatus[id]);
    if (activeSelected.length === 0) return;
    setActionLoading(true);
    try {
      await stopAnalytics(activeSelected);
      await fetchData();
    } catch (err) {
      alert("Error stopping analytics");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400 p-6 flex justify-center">Loading cameras...</div>;
  if (error) return <div className="text-red-400 p-6 flex justify-center items-center"><AlertTriangle className="mr-2"/> {error}</div>;
  if (cameras.length === 0) return <div className="text-gray-400 p-6 text-center">No cameras registered. Add cameras in the Registry first.</div>;

  return (
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <MonitorPlay className="w-6 h-6 mr-3 text-blue-400" /> Live Monitoring
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300 bg-gray-900 px-3 py-1 rounded">
            Selected: <span className="text-blue-400">{selectedIds.length}</span>
          </span>
          <button onClick={handleSelectAll} className="text-sm text-gray-400 hover:text-white transition-colors">Select All</button>
          <button onClick={handleClear} className="text-sm text-gray-400 hover:text-white transition-colors">Clear</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-900 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cameras.map(cam => (
              <CameraTile 
                key={cam.id} 
                camera={cam} 
                isSelected={selectedIds.includes(cam.id)}
                toggleSelection={toggleSelection}
                onPreview={setPreviewCamera}
                analyticsData={analyticsStatus[cam.id]}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[22rem] flex flex-col space-y-4 flex-shrink-0 h-full overflow-hidden">
          <div className="h-[250px] shrink-0">
            {previewCamera ? (
              <StreamPreview 
                camera={previewCamera} 
                onClose={() => setPreviewCamera(null)} 
                analyticsData={analyticsStatus[previewCamera.id]} 
              />
            ) : (
              <div className="h-full bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm p-6 text-center">
                Select a camera tile to view stream preview
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <AnalyticsPanel 
              selectedCameras={selectedIds}
              cameras={cameras}
              analyticsStatus={analyticsStatus}
              onStart={handleStartAnalytics}
              onStop={handleStopAnalytics}
              loading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LiveMonitoring;
