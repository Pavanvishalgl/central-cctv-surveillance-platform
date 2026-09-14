import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Radio, Route, Bell, Shield, BarChart3, Network } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Camera Registry', path: '/cameras', icon: Camera },
    { name: 'Live Monitoring', path: '/monitoring', icon: Radio },
    { name: 'VMS Federation', path: '/vms', icon: Network },
    { name: 'Vehicle Tracking', path: '/tracking', icon: Route },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Watchlist', path: '/watchlist', icon: Shield },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-700 font-bold text-lg text-blue-400 tracking-wider">
        GUJARAT CCTV INTEL
      </div>
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-900/50 text-blue-400 border-r-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;
