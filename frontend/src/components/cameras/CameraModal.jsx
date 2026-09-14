import React, { useState } from 'react';
import { createCamera, updateCamera } from '../../services/api';
import { X } from 'lucide-react';

const CameraModal = ({ camera, onClose, onSuccess }) => {
  const isEdit = !!camera;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    camera_code: camera?.camera_code || '',
    camera_name: camera?.camera_name || '',
    department: camera?.department || '',
    location_name: camera?.location_name || '',
    latitude: camera?.latitude || '',
    longitude: camera?.longitude || '',
    stream_url: camera?.stream_url || '',
    protocol: camera?.protocol || 'RTSP',
    status: camera?.status || 'ACTIVE'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) };
    
    try {
      if (isEdit) {
        await updateCamera(camera.id, payload);
      } else {
        await createCamera(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-xl font-bold text-gray-100">{isEdit ? 'Edit Camera' : 'Register New Camera'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Camera Code *</label>
              <input required type="text" name="camera_code" value={formData.camera_code} onChange={handleChange} disabled={isEdit} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Camera Name *</label>
              <input required type="text" name="camera_name" value={formData.camera_name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Department *</label>
              <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location Name *</label>
              <input required type="text" name="location_name" value={formData.location_name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Latitude *</label>
              <input required type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Longitude *</label>
              <input required type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Stream URL *</label>
              <input required type="text" name="stream_url" value={formData.stream_url} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Protocol</label>
              <select name="protocol" value={formData.protocol} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500">
                <option value="RTSP">RTSP</option>
                <option value="HTTP">HTTP</option>
                <option value="ONVIF">ONVIF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Register Camera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CameraModal;
