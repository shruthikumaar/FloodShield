import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertTriangle, Info, BellRing } from 'lucide-react';

const CitizenAlerts: React.FC = () => {
  const { alerts } = useEmergency();
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});

  const toggleAlertDetails = (id: string) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'URGENT': return <AlertTriangle size={24} color="var(--status-danger)" />;
      case 'WARNING': return <BellRing size={24} color="var(--status-caution)" />;
      case 'INFORMATION': return <Info size={24} color="var(--status-info)" />;
      default: return <Info size={24} color="var(--status-info)" />;
    }
  };

  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'URGENT': return 'badge-danger';
      case 'WARNING': return 'badge-caution';
      case 'INFORMATION': return 'badge-info';
      default: return 'badge-info';
    }
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Emergency Alerts</h2>
      
      <div className="flex flex-col gap-4">
        {alerts.map(alert => (
          <div key={alert.id} className="card flex gap-4 items-start" style={{ borderLeft: `4px solid var(--status-${alert.type === 'URGENT' ? 'danger' : alert.type === 'WARNING' ? 'caution' : 'info'})` }}>
            <div style={{ marginTop: '4px' }}>
              {getIcon(alert.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between items-start mb-2">
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{alert.title}</h4>
                <div className={`badge ${getBadgeClass(alert.type)}`}>{alert.type}</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>{alert.description}</p>
              
              <div className="flex gap-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div><strong>Location:</strong> {alert.location}</div>
                <div><strong>Date:</strong> {alert.date}</div>
                <div><strong>Time:</strong> {alert.time}</div>
              </div>
              
              <button 
                className="btn btn-outline mt-4"
                onClick={() => toggleAlertDetails(alert.id)}
              >
                {expandedAlerts[alert.id] ? 'Hide Details' : 'View Details'}
              </button>
              
              {expandedAlerts[alert.id] && alert.details && (
                <div className="mt-4 p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary, #f1f5f9)', color: 'var(--text-primary)' }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>Additional Information</h5>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{alert.details}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenAlerts;
