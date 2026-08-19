import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { ActivitySquare, MapPin } from 'lucide-react';

const mockSensors = [
  { id: 'SENSOR-001', location: 'Ward 12', rainfall: 65, water: 0.82, status: 'WARNING', updated: '1 minute ago' },
  { id: 'SENSOR-002', location: 'Lake Road', rainfall: 12, water: 0.15, status: 'SAFE', updated: '2 minutes ago' },
  { id: 'SENSOR-003', location: 'Market Area', rainfall: 40, water: 0.45, status: 'CAUTION', updated: '1 minute ago' },
  { id: 'SENSOR-004', location: 'Main Bridge', rainfall: 110, water: 1.5, status: 'DANGER', updated: 'Just now' },
];

const GovSensors: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Sensor Monitoring</h2>
      
      <div className="dashboard-grid">
        {mockSensors.map(sensor => (
          <div key={sensor.id} className="card" style={{ borderTop: `4px solid var(--status-${sensor.status === 'WARNING' || sensor.status === 'CAUTION' ? 'caution' : sensor.status === 'DANGER' ? 'danger' : 'safe'})` }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <ActivitySquare size={16} color="var(--brand-primary)" />
                  {sensor.id}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {sensor.location}
                </div>
              </div>
              <div className={`badge badge-${sensor.status === 'WARNING' || sensor.status === 'CAUTION' ? 'caution' : sensor.status === 'DANGER' ? 'danger' : 'safe'}`}>
                {sensor.status}
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RAINFALL</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{sensor.rainfall} mm/hr</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WATER LEVEL</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{sensor.water} m</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Updated: {sensor.updated}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovSensors;
