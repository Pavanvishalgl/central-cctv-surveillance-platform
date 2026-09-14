import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_URL || "http://localhost:8000"}/api/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll for alerts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white text-red-500">System Alerts</h1>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Camera ID</th>
              <th className="p-4">Watchlist ID</th>
              <th className="p-4">Detection</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Status</th>
              <th className="p-4">Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4">{new Date(a.timestamp).toLocaleString()}</td>
                <td className="p-4">Camera #{a.camera_id}</td>
                <td className="p-4">Watchlist #{a.watchlist_id}</td>
                <td className="p-4 text-red-400 font-bold">{a.detection_class.toUpperCase()}</td>
                <td className="p-4">{(a.confidence * 100).toFixed(1)}%</td>
                <td className="p-4">
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">{a.message || "-"}</td>
              </tr>
            ))}
            {alerts.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No alerts detected</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alerts;
