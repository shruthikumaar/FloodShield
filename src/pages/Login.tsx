import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Building2 } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    // Mock login
    login(selectedRole, { 
      name: selectedRole === 'CITIZEN' ? 'John Doe' : 'Officer Smith',
      mobile: '9876543210'
    });

    if (selectedRole === 'CITIZEN') {
      navigate('/app/citizen/home');
    } else {
      navigate('/app/government/home');
    }
  };

  const handleGuest = () => {
    login('GUEST', { name: 'Guest User' });
    navigate('/app/citizen/home');
  };

  if (!selectedRole) {
    return (
      <div className="login-container">
        <div className="login-header">
          <ShieldAlert size={48} color="var(--brand-primary)" />
          <h1>FloodSafe</h1>
          <p className="subtitle">Dynamic Evacuation & Disaster Intelligence</p>
        </div>

        <h2 className="role-selection-title">Select Your Role</h2>
        
        <div className="role-cards">
          <div className="role-card" onClick={() => setSelectedRole('CITIZEN')}>
            <div className="role-icon">
              <User size={32} />
            </div>
            <h3>CITIZEN</h3>
            <p>Get live safety information, evacuation routes and nearby shelters.</p>
          </div>
          
          <div className="role-card" onClick={() => setSelectedRole('GOVERNMENT')}>
            <div className="role-icon">
              <Building2 size={32} />
            </div>
            <h3>GOVERNMENT</h3>
            <p>Monitor flood conditions, shelters, roads and emergency situations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <ShieldAlert size={36} color="var(--brand-primary)" />
          <h2>{selectedRole} LOGIN</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Mobile number / Email</label>
            <input type="text" className="form-input" required defaultValue={selectedRole === 'CITIZEN' ? 'citizen@example.com' : 'gov@floodsafe.gov'} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required defaultValue="password123" />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ marginBottom: '12px' }}>
            LOGIN
          </button>
          <button type="button" className="btn btn-outline w-full" onClick={handleGuest}>
            CONTINUE AS GUEST
          </button>

          <div className="login-links">
            <a href="#">Forgot Password?</a>
            <a href="#">Create Account</a>
          </div>
        </form>
        
        <button 
          className="btn btn-outline w-full mt-4" 
          onClick={() => setSelectedRole(null)}
          style={{ border: 'none', color: 'var(--text-secondary)' }}
        >
          ← Back to Role Selection
        </button>
      </div>
    </div>
  );
};

export default Login;
