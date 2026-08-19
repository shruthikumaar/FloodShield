import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { ShieldAlert } from 'lucide-react';

const GovShelters: React.FC = () => {
  const { shelters } = useEmergency();

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Shelter Capacity Monitoring</h2>
      
      <div className="flex flex-col gap-4">
        {shelters.map(shelter => (
          <div key={shelter.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} color="var(--brand-primary)" />
                {shelter.name}
              </h3>
              <div className={`badge ${shelter.status === 'FULL' ? 'badge-danger' : 'badge-safe'}`}>
                {shelter.status}
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL CAPACITY</div>
                <div style={{ fontWeight: 600, fontSize: '1.5rem' }}>{shelter.capacity}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OCCUPIED</div>
                <div style={{ fontWeight: 600, fontSize: '1.5rem' }}>{shelter.capacity - shelter.available}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AVAILABLE</div>
                <div style={{ fontWeight: 600, fontSize: '1.5rem', color: shelter.available === 0 ? 'var(--status-danger)' : 'var(--status-safe)' }}>
                  {shelter.available}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className="btn btn-outline">Update Capacity</button>
              <button className="btn btn-outline">Mark as {shelter.status === 'FULL' ? 'OPEN' : 'FULL'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovShelters;
