import React, { useState } from 'react';
import { useEmergency, IncidentReport } from '../../context/EmergencyContext';
import { CheckCircle, AlertTriangle, Clock, MapPin, Search, Filter } from 'lucide-react';

const GovReports: React.FC = () => {
  const { incidentReports, updateIncidentStatus } = useEmergency();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'RESOLVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = incidentReports.filter(report => {
    const matchesFilter = filter === 'ALL' || report.status === filter;
    const matchesSearch = report.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-caution">PENDING</span>;
      case 'VERIFIED': return <span className="badge badge-danger">VERIFIED</span>;
      case 'RESOLVED': return <span className="badge badge-safe">RESOLVED</span>;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h2>Citizen Incident Reports</h2>
        <div className="flex gap-4">
          <div className="flex items-center" style={{ backgroundColor: 'var(--bg-primary)', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'none', padding: '10px', outline: 'none', width: '200px' }}
            />
          </div>
          <div className="flex items-center" style={{ backgroundColor: 'var(--bg-primary)', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              style={{ border: 'none', background: 'none', padding: '10px', outline: 'none' }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredReports.length === 0 ? (
          <div className="card text-center" style={{ gridColumn: '1 / -1', padding: '48px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No incident reports found.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="card flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Clock size={12} /> {report.timestamp}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{report.type}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {report.location}
                  </div>
                </div>
                {getStatusBadge(report.status)}
              </div>

              {report.photoBase64 && (
                <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#f1f5f9' }}>
                  <img src={report.photoBase64} alt="Incident Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>DESCRIPTION</div>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{report.description}</p>
              </div>

              <div className="flex gap-2 mt-auto">
                {report.status === 'PENDING' && (
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, backgroundColor: 'var(--status-danger)' }}
                    onClick={() => updateIncidentStatus(report.id, 'VERIFIED')}
                  >
                    <AlertTriangle size={16} style={{ marginRight: '6px' }} /> Verify
                  </button>
                )}
                {(report.status === 'PENDING' || report.status === 'VERIFIED') && (
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, borderColor: 'var(--status-safe)', color: 'var(--status-safe)' }}
                    onClick={() => updateIncidentStatus(report.id, 'RESOLVED')}
                  >
                    <CheckCircle size={16} style={{ marginRight: '6px' }} /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GovReports;
