import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertCircle, Info, Clock, CheckCircle } from 'lucide-react';
import { getVehicleHistory } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Tracking = () => {
  const [vehicleId, setVehicleId] = useState('DEMO-VEH-001');
  const [searchId, setSearchId] = useState('DEMO-VEH-001');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [searchId]);

  const fetchHistory = async () => {
    if (!searchId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicleHistory(searchId);
      setHistory(data);
    } catch (err) {
      setError("Failed to load vehicle history.");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchId(vehicleId);
  };

  const center = history?.events?.length > 0 
    ? [history.events[0].latitude, history.events[0].longitude] 
    : [23.0225, 72.5714]; // Default Ahmedabad

  const positions = history?.events?.filter(e => e.latitude && e.longitude).map(e => [e.latitude, e.longitude]) || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 flex items-start space-x-3 text-blue-200">
        <Info className="w-6 h-6 flex-shrink-0 mt-0.5 text-blue-400" />
        <div>
          <h3 className="font-bold">Vehicle movement history infrastructure — DEMO</h3>
          <p className="text-sm opacity-80 mt-1">
            Cross-camera vehicle identity requires ANPR/re-identification, not currently enabled. 
            This view demonstrates the event architecture and UI workflow using synthetic demonstration data.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left Column: Search & Table */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-4 h-full overflow-hidden">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Vehicle Tracking</h2>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  placeholder="Enter Vehicle ID (e.g., DEMO-VEH-001)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Track
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
              <h3 className="font-bold text-gray-200">Movement History</h3>
              {loading && <span className="text-sm text-gray-400 animate-pulse">Loading...</span>}
            </div>
            
            <div className="flex-1 overflow-auto">
              {error ? (
                <div className="p-8 text-center text-red-400 flex flex-col items-center">
                  <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                  <p>{error}</p>
                </div>
              ) : history?.events?.length > 0 ? (
                <table className="w-full text-left text-gray-300">
                  <thead className="bg-gray-900 text-gray-400 sticky top-0">
                    <tr>
                      <th className="p-3 text-sm">Time</th>
                      <th className="p-3 text-sm">Camera</th>
                      <th className="p-3 text-sm">Detection</th>
                      <th className="p-3 text-sm">Conf</th>
                      <th className="p-3 text-sm">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.events.map((evt, idx) => (
                      <tr key={evt.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="p-3 whitespace-nowrap text-sm">
                          <div className="flex items-center text-gray-200">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(evt.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="text-xs text-gray-500 ml-6">
                            {new Date(evt.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-3 font-medium">CAM-{evt.camera_id}</td>
                        <td className="p-3 text-sm">
                          <span className="capitalize">{evt.detection_class}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-400">
                          {(evt.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="p-3">
                          {evt.is_demo ? (
                            <span className="bg-purple-900/40 text-purple-400 border border-purple-800 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                              DEMO
                            </span>
                          ) : (
                            <span className="bg-blue-900/40 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                              LIVE
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <MapPin className="w-12 h-12 mb-3 opacity-20" />
                  <p>No movement history found for this vehicle ID.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col relative h-[400px] lg:h-auto">
          <div className="absolute top-4 left-4 z-[1000] bg-gray-900/80 backdrop-blur border border-gray-700 rounded px-3 py-2 pointer-events-none">
            <h3 className="font-bold text-gray-100 text-sm">Geospatial Trail</h3>
            {history?.events && <p className="text-xs text-gray-400">{history.events.length} waypoints</p>}
          </div>
          
          <MapContainer 
            key={history ? history.vehicle_id : 'default'} 
            center={center} 
            zoom={12} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            {positions.length > 0 && (
              <Polyline 
                positions={positions} 
                color="#3b82f6" 
                weight={3} 
                opacity={0.7} 
                dashArray="5, 10" 
              />
            )}

            {history?.events?.map((evt, idx) => (
              evt.latitude && evt.longitude ? (
                <Marker key={evt.id} position={[evt.latitude, evt.longitude]}>
                  <Popup className="custom-popup">
                    <div className="text-gray-800 p-1">
                      <p className="font-bold mb-1">CAM-{evt.camera_id}</p>
                      <p className="text-sm">Time: {new Date(evt.timestamp).toLocaleTimeString()}</p>
                      <p className="text-sm">Det: {evt.detection_class}</p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
