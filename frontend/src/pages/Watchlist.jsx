import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ type: 'stolen_vehicle', identifier: '', description: '' });

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_URL || "http://localhost:8000"}/api/watchlist`);
      const data = await res.json();
      setWatchlist(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL || "http://localhost:8000"}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormData({ type: 'stolen_vehicle', identifier: '', description: '' });
      fetchWatchlist();
    } catch (e) {
      console.error("Failed to add to watchlist", e);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Watchlist Management</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-white">Add New Watchlist Entity</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
          <select 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="stolen_vehicle">Stolen Vehicle</option>
            <option value="blacklisted_vehicle">Blacklisted Vehicle</option>
            <option value="wanted_person">Wanted Person</option>
            <option value="missing_person">Missing Person</option>
            <option value="suspect">Suspect</option>
          </select>
          <input 
            type="text" 
            placeholder="Identifier (e.g. 'car', 'person', 'truck')" 
            value={formData.identifier}
            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />
          <input 
            type="text" 
            placeholder="Description (Optional)" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to Watchlist
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Identifier</th>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(w => (
              <tr key={w.id} className="border-t border-gray-700">
                <td className="p-4">{w.type.replace('_', ' ').toUpperCase()}</td>
                <td className="p-4">{w.identifier}</td>
                <td className="p-4">{w.name || "-"}</td>
                <td className="p-4">{w.description}</td>
                <td className="p-4">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
            {watchlist.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No watchlist entries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;
