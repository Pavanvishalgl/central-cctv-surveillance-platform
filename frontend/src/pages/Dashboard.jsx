import React, { useEffect, useState } from 'react';
import { getCameras, getAnalyticsStatus, getEvents, API_URL } from '../services/api';
import MapViewer from '../components/map/MapViewer';
import { Camera, Activity, AlertTriangle, List, MapPin, Server, Play, ShieldAlert, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.bg} ${colorClass.text}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const ActionButton = ({ to, icon: Icon, label, desc }) => (
  <Link to={to} className="flex items-start p-4 bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-colors rounded-lg group">
    <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div className="ml-4">
      <h4 className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{label}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const [data, setData] = useState({
    cameras: [],
    analytics: {},
    watchlist: [],
    alerts: [],
    events: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cams, anStats, evts] = await Promise.all([
          getCameras(),
          getAnalyticsStatus().catch(() => ({})),
          getEvents().catch(() => [])
        ]);
        
        const wlRes = await fetch(`${API_URL}/api/watchlist`).catch(() => ({ json: () => [] }));
        const wlData = wlRes.ok ? await wlRes.json() : [];
        
        const alRes = await fetch(`${API_URL}/api/alerts`).catch(() => ({ json: () => [] }));
        const alData = alRes.ok ? await alRes.json() : [];

        setData({
          cameras: cams,
          analytics: anStats,
          watchlist: wlData,
          alerts: alData,
          events: evts
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeAnalyticsCount = Object.values(data.analytics).filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-2 pb-6">
      
      {/* Demo Status Banner */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-lg font-bold text-blue-400 flex items-center">
            <Server className="w-5 h-5 mr-2" /> SYSTEM DEMO STATUS
          </h2>
          <p className="text-xs text-blue-300 mt-1">Hackathon MVP - Live features successfully integrated</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-4 md:mt-0 text-xs text-gray-300 font-medium">
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Sentinel Camera Registry</span>
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Live RTSP/TCP Streaming</span>
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> YOLO11n Detection</span>
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Watchlist & Alerts</span>
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> Vehicle Movement History</span>
          <span className="flex items-center"><span className="text-green-400 mr-2">✓</span> VMS Federation</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Cameras" value={loading ? '-' : data.cameras.length} icon={Camera} colorClass={{ bg: 'bg-gray-500', text: 'text-gray-400' }} />
        <StatCard title="Available" value={loading ? '-' : data.cameras.filter(c => c.status === 'ACTIVE').length} icon={Activity} colorClass={{ bg: 'bg-green-500', text: 'text-green-400' }} />
        <StatCard title="Active Analytics" value={loading ? '-' : activeAnalyticsCount} icon={Play} colorClass={{ bg: 'bg-blue-500', text: 'text-blue-400' }} />
        <StatCard title="Watchlist" value={loading ? '-' : data.watchlist.length} icon={List} colorClass={{ bg: 'bg-purple-500', text: 'text-purple-400' }} />
        <StatCard title="Alerts" value={loading ? '-' : data.alerts.length} icon={ShieldAlert} colorClass={{ bg: 'bg-red-500', text: 'text-red-400' }} />
        <StatCard title="Events (Demo)" value={loading ? '-' : data.events.length} icon={MapPin} colorClass={{ bg: 'bg-yellow-500', text: 'text-yellow-400' }} />
      </div>
      
      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <ActionButton to="/monitoring" icon={Play} label="Live Monitoring" desc="View streams & run analytics" />
          <ActionButton to="/tracking" icon={Navigation} label="Vehicle Tracking" desc="View DEMO movement history" />
          <ActionButton to="/watchlist" icon={List} label="Watchlist" desc="Manage entities & vehicles" />
          <ActionButton to="/alerts" icon={ShieldAlert} label="Alerts" desc="Review detection matches" />
          <ActionButton to="/vms" icon={Server} label="VMS Federation" desc="External system integration" />
          <ActionButton to="/cameras" icon={Camera} label="Registry" desc="Manage 30 Sentinel cameras" />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[400px] bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" /> Live GIS Map
          </h3>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Showing {data.cameras.length} cameras</span>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-700">
          {!loading ? <MapViewer cameras={data.cameras} /> : <div className="animate-pulse bg-gray-700 w-full h-full"></div>}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
