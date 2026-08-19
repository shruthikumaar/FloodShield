import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, User, LogOut, Settings, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export const Topbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {role === 'CITIZEN' && (
          <div className="topbar-location">
            <MapPin size={16} color="var(--brand-primary)" />
            <span>Detecting location...</span>
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-dropdown">
          <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className="profile-name">{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role}</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="profile-menu">
              <button className="menu-item" onClick={() => { setDropdownOpen(false); navigate('/app/profile'); }}>
                <User size={16} /> Profile
              </button>
              <button className="menu-item" onClick={() => setDropdownOpen(false)}>
                <Phone size={16} /> Emergency Contact
              </button>
              <button className="menu-item" onClick={() => setDropdownOpen(false)}>
                <Settings size={16} /> Settings
              </button>
              <button className="menu-item logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
