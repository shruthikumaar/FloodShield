import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CloudRain, Shield, Activity, MapPin } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useNavigate } from 'react-router-dom';

const GovControlCenter: React.FC = () => {
  const { alerts, shelters, triggerFloodEvent } = useEmergency();
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);

  const activeAlertsCount = alerts.length;
  const openSheltersCount = shelters.filter(s => s.status !== 'CLOSED').length;
  const availableCapacity = shelters.reduce((acc, curr) => acc + curr.available, 0);

  return (
    <div className="dashboard-container" style={{ display: 'flex', gap: '24px' }}>
      
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <h2 className="mb-4">Emergency Control Center</h2>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ borderTop: '4px solid var(--status-danger)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle color="var(--status-danger)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ACTIVE ALERTS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{activeAlertsCount}</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--status-flooded)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin color="var(--status-flooded)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>FLOODED ROADS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>12</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--status-safe)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield color="var(--status-safe)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>OPEN SHELTERS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{openSheltersCount}</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--brand-primary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity color="var(--brand-primary)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ACTIVE SENSORS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>26</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3>CREATE EMERGENCY ALERT</h3>
            <button className="btn btn-outline" onClick={() => setPanelOpen(!panelOpen)}>
              Toggle Quick Panel
            </button>
          </div>
          
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Alert Type</label>
              <select className="form-input">
                <option>URGENT</option>
                <option>WARNING</option>
                <option>INFORMATION</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Affected Location</label>
              <input type="text" className="form-input" placeholder="e.g., Ward 12" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={3}></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Target</label>
            <select className="form-input">
              <option>All users</option>
              <option>Specific ward</option>
              <option>Specific area</option>
            </select>
          </div>
          
          <button className="btn btn-primary">SEND ALERT</button>
        </div>

        <div className="card" style={{ backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger)' }}>
          <h3 style={{ color: 'var(--status-danger)' }}>Prototype Controls</h3>
          <p>Use this to test the dynamic routing response for citizens.</p>
          <button className="btn btn-primary" style={{ backgroundColor: 'var(--status-danger)' }} onClick={triggerFloodEvent}>
            Trigger Flood Event (Simulate Blocked Route)
          </button>
        </div>
      </div>

      {/* Right Side Quick Panel */}
      {panelOpen && (
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Quick Panel</h3>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AVAILABLE CAPACITY</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>{availableCapacity} spaces</div>
            
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>RECENT REPORTS</div>
            <div className="mt-2 flex flex-col gap-2">
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                <span className="badge badge-flooded mb-1">Flooded Road</span><br/>
                Lake Road - reported 5 mins ago
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                <span className="badge badge-caution mb-1">Waterlogging</span><br/>
                Market Road - reported 15 mins ago
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovControlCenter;
