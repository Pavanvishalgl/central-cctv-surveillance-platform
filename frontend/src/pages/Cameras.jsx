import React, { useState, useEffect } from 'react';
import { getCameras, deleteCamera } from '../services/api';
import CameraModal from '../components/cameras/CameraModal';
import { Plus, Search, Trash2, Edit, Video } from 'lucide-react';

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (err) {
      console.error("Failed to fetch cameras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this camera?")) {
      try {
        await deleteCamera(id);
        fetchCameras();
      } catch (err) {
        alert("Failed to delete camera.");
      }
    }
  };

  const filtered = cameras.filter(c => {
    const matchesSearch = c.camera_name.toLowerCase().includes(search.toLowerCase()) || 
                          c.camera_code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'All' || c.department === filterDept;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['All', ...new Set(cameras.map(c => c.department))];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center">
          <Video className="mr-3 w-6 h-6 text-blue-400" /> Camera Registry
        </h2>
        <button 
          onClick={() => { setEditingCamera(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Camera
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select 
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading cameras...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No cameras found.</td></tr>
              ) : (
                filtered.map(cam => (
                  <tr key={cam.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-mono text-gray-300">{cam.camera_code}</td>
                    <td className="px-6 py-4 text-gray-200">{cam.camera_name}</td>
                    <td className="px-6 py-4">{cam.department}</td>
                    <td className="px-6 py-4">{cam.location_name}</td>
                    <td className="px-6 py-4">{cam.protocol}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cam.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : cam.status === 'INACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {cam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditingCamera(cam); setModalOpen(true); }} className="text-blue-400 hover:text-blue-300 mr-3"><Edit className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(cam.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <CameraModal 
          camera={editingCamera} 
          onClose={() => setModalOpen(false)} 
          onSuccess={() => { setModalOpen(false); fetchCameras(); }}
        />
      )}
    </div>
  );
};
export default Cameras;
