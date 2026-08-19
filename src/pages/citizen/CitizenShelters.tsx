import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { ShieldAlert, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CitizenShelters: React.FC = () => {
  const { shelters } = useEmergency();
  const navigate = useNavigate();

  // Sort by available capacity (descending), then by distance (ascending)
  const sortedShelters = [...shelters].sort((a, b) => {
    if (a.status === 'FULL' && b.status !== 'FULL') return 1;
    if (a.status !== 'FULL' && b.status === 'FULL') return -1;
    if (b.available !== a.available) return b.available - a.available;
    return a.distance - b.distance;
  });

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Nearby Safe Shelters</h2>
      
      <div className="flex flex-col gap-4">
        {sortedShelters.map(shelter => (
          <div key={shelter.id} className="card" style={{ opacity: shelter.status === 'FULL' ? 0.7 : 1 }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color={shelter.status === 'FULL' ? 'var(--status-danger)' : 'var(--brand-primary)'} />
                  {shelter.name}
                </h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Distance: {shelter.distance} km
                </div>
              </div>
              <div className={`badge ${shelter.status === 'FULL' ? 'badge-danger' : 'badge-safe'}`}>
                {shelter.status}
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CAPACITY</div>
                <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{shelter.capacity}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AVAILABLE</div>
                <div style={{ fontWeight: 600, fontSize: '1.25rem', color: shelter.status === 'FULL' ? 'var(--status-danger)' : 'var(--status-safe)' }}>
                  {shelter.available}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>FACILITIES</div>
              <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
                {shelter.facilities.map(fac => (
                  <span key={fac} style={{ backgroundColor: 'var(--bg-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn btn-outline" style={{ flex: 1 }}>View Details</button>
              {shelter.status !== 'FULL' && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, gap: '8px' }}
                  onClick={() => navigate('/app/citizen/route', { state: { shelterId: shelter.id } })}
                >
                  <Navigation size={16} />
                  Select & Navigate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenShelters;
