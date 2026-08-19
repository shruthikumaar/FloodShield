import React, { useState } from 'react';
import { History, Search, Map as MapIcon } from 'lucide-react';

const mockHistory = [
  { id: 1, date: '18 June 2024', type: 'Heavy Rainfall / Urban Flooding', time: '7:30 PM', duration: '3 hours', impact: 'Road flooding reported', source: 'IMD' },
  { id: 2, date: '12 August 2023', type: 'Urban Flooding', time: '5:45 PM', duration: '5 hours', impact: 'Low-lying areas affected', source: 'Municipal Corp' },
  { id: 3, date: '28 July 2022', type: 'Heavy Rainfall', time: '8:10 PM', duration: '2 hours', impact: 'Waterlogging reported', source: 'Citizen Report' },
];

const DisasterHistory: React.FC = () => {
  const [searched, setSearched] = useState(false);

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Disaster History</h2>

      <div className="card mb-4">
        <h3 className="mb-4">Select Location</h3>
        
        <div className="form-group relative">
          <Search size={20} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search area, village, ward or city" 
            style={{ paddingLeft: '40px' }} 
            defaultValue="Angondhalli"
          />
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Disaster Type</label>
            <select className="form-input">
              <option>Flood</option>
              <option>Heavy Rainfall</option>
              <option>Landslide</option>
              <option>Cyclone</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Time Period</label>
            <select className="form-input">
              <option>Last 5 years</option>
              <option>Last year</option>
              <option>Last 10 years</option>
              <option>All history</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setSearched(true)}>
          View History
        </button>
      </div>

      {searched && (
        <>
          <div style={{ textAlign: 'center', margin: '32px 0 16px' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>ANGONDHALLI</h3>
            <div style={{ color: 'var(--status-flooded)', fontWeight: 600 }}>FLOOD HISTORY</div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {mockHistory.map(item => (
              <div key={item.id} className="card" style={{ borderLeft: '4px solid var(--status-caution)' }}>
                <div className="flex justify-between mb-2">
                  <div style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{item.date}</div>
                  <div className="badge badge-caution">{item.type}</div>
                </div>
                
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TIME</div>
                    <div style={{ fontWeight: 500 }}>{item.time}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DURATION</div>
                    <div style={{ fontWeight: 500 }}>{item.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SOURCE</div>
                    <div style={{ fontWeight: 500 }}>{item.source}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>IMPACT</div>
                  <div>{item.impact}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-4">Historical Disaster Map</h3>
          <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb', flexDirection: 'column', gap: '8px' }}>
            <MapIcon size={48} color="var(--text-secondary)" />
            <div style={{ color: 'var(--text-secondary)' }}>Historical Map View (Placeholder)</div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisasterHistory;
