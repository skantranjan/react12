import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CmDashboard from './pages/CmDashboard';
import CmSkuDetail from './pages/CmSkuDetail';
import SedForApproval from './pages/SedForApproval';
import GeneratePdf from './pages/GeneratePdf';
import UploadData from './pages/UploadData';
import AuditLog from './pages/AuditLog';

import './assets/css/styles.css';
import './assets/css/remix-icon.css';
import './assets/css/multi-select.css';
import './assets/css/pagination.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Navigate to="/cm-dashboard" replace />} />
        <Route path="/dasbboard" element={<Navigate to="/cm-dashboard" replace />} />
        <Route path="/cm-dashboard" element={<CmDashboard />} />
        <Route path="/cm-sku-details" element={<CmSkuDetail />} />
        <Route path="/cm/:cmCode" element={<CmSkuDetail />} />
        <Route path="/sedforapproval" element={<SedForApproval />} />
        <Route path="/generate-pdf" element={<GeneratePdf />} />
        <Route path="/upload-data" element={<UploadData />} />
        <Route path="/audit-log" element={<AuditLog />} />
      </Routes>
    </Router>
  );
}

export default App;
