import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { AppLayout } from './components/layout/AppLayout';

// Citizen Pages
import CitizenHome from './pages/citizen/CitizenHome';
import CitizenMap from './pages/citizen/CitizenMap';
import CitizenShelters from './pages/citizen/CitizenShelters';
import RoutePlanning from './pages/citizen/RoutePlanning';
import DisasterHistory from './pages/citizen/DisasterHistory';
import CitizenAlerts from './pages/citizen/CitizenAlerts';
import ReportIncident from './pages/citizen/ReportIncident';

// Shared Pages
import Profile from './pages/Profile';

// Government Pages
import GovControlCenter from './pages/government/GovControlCenter';
import GovMap from './pages/government/GovMap';
import GovSensors from './pages/government/GovSensors';
import GovShelters from './pages/government/GovShelters';
import GovReports from './pages/government/GovReports';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout />}>
          
          {/* Citizen Routes */}
          <Route path="citizen/home" element={<CitizenHome />} />
          <Route path="citizen/map" element={<CitizenMap />} />
          <Route path="citizen/shelters" element={<CitizenShelters />} />
          <Route path="citizen/route" element={<RoutePlanning />} />
          <Route path="citizen/history" element={<DisasterHistory />} />
          <Route path="citizen/alerts" element={<CitizenAlerts />} />
          <Route path="citizen/report" element={<ReportIncident />} />

          {/* Government Routes */}
          <Route path="government/home" element={<GovControlCenter />} />
          <Route path="government/map" element={<GovMap />} />
          <Route path="government/sensors" element={<GovSensors />} />
          <Route path="government/shelters" element={<GovShelters />} />
          <Route path="government/reports" element={<GovReports />} />
          
          {/* Shared Routes */}
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
