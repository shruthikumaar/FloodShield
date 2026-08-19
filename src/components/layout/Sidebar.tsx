import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Map, ShieldAlert, Navigation, History, Bell, 
  FileText, Activity, Layers, ActivitySquare, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const CitizenLinks = [
  { to: '/app/citizen/home', label: 'Home', icon: <Home size={20} /> },
  { to: '/app/citizen/map', label: 'Live Map', icon: <Map size={20} /> },
  { to: '/app/citizen/shelters', label: 'Shelters', icon: <ShieldAlert size={20} /> },
  { to: '/app/citizen/route', label: 'Evacuation Route', icon: <Navigation size={20} /> },
  { to: '/app/citizen/history', label: 'Disaster History', icon: <History size={20} /> },
  { to: '/app/citizen/alerts', label: 'Alerts', icon: <Bell size={20} /> },
  { to: '/app/citizen/report', label: 'Report Incident', icon: <FileText size={20} /> },
];

const GovernmentLinks = [
  { to: '/app/government/home', label: 'Control Center', icon: <Activity size={20} /> },
  { to: '/app/government/map', label: 'Live Monitoring', icon: <Layers size={20} /> },
  { to: '/app/government/sensors', label: 'Sensors', icon: <ActivitySquare size={20} /> },
  { to: '/app/government/shelters', label: 'Shelters Mgmt', icon: <ShieldAlert size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  
  const links = role === 'GOVERNMENT' ? GovernmentLinks : CitizenLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert color="var(--brand-primary)" />
          FloodSafe
        </h2>
        {role === 'GOVERNMENT' && <div className="role-badge">GOVERNMENT</div>}
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
