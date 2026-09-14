import React, { useState } from 'react';
import { registerVMS } from '../../services/api';
import { X } from 'lucide-react';

const VMSModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    vendor: 'Mock',
    host: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerVMS(formData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-xl font-bold text-gray-100">Register VMS Source</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">VMS Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. Surat Traffic VMS" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Vendor/Type *</label>
              <select name="vendor" value={formData.vendor} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-indigo-500">
                <option value="Mock">Simulated / Mock VMS</option>
                <option value="Milestone">Milestone XProtect (Future)</option>
                <option value="Genetec">Genetec Security Center (Future)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Host/Endpoint *</label>
              <input required type="text" name="host" value={formData.host} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. 192.168.1.50" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50">
              {loading ? 'Registering...' : 'Register VMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VMSModal;
