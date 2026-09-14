import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import ComingSoon from './pages/ComingSoon';

import LiveMonitoring from './pages/LiveMonitoring';
import VMSFederation from './pages/VMSFederation';
import Watchlist from './pages/Watchlist';
import Alerts from './pages/Alerts';
import Tracking from './pages/Tracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="monitoring" element={<LiveMonitoring />} />
          <Route path="vms" element={<VMSFederation />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
