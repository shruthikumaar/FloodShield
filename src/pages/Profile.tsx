import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Bell, MapPin, Globe, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Profile</h2>

      <div className="card flex items-center gap-6 mb-6">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600 }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 style={{ marginBottom: '4px' }}>{user?.name || 'User'}</h3>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{user?.mobile}</div>
          <div className="badge badge-info">{role}</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        <div className="card">
          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <User size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Personal Information</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>
            
            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <Phone size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Emergency Contact</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>
            
            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <Bell size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Notification Settings</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>
            
            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <MapPin size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Location Settings</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>

            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <Globe size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Language</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>

            <button className="flex items-center justify-between w-full" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', cursor: 'pointer' }}>
              <div className="flex items-center gap-4">
                <Shield size={20} color="var(--text-secondary)" />
                <span style={{ fontWeight: 500 }}>Privacy</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </button>

            <button onClick={handleLogout} className="flex items-center w-full" style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              <div className="flex items-center gap-4">
                <LogOut size={20} color="var(--status-danger)" />
                <span style={{ fontWeight: 500, color: 'var(--status-danger)' }}>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
