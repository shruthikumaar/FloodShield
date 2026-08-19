import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertTriangle, Info, BellRing } from 'lucide-react';

const CitizenAlerts: React.FC = () => {
  const { alerts } = useEmergency();

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
              
              <button className="btn btn-outline mt-4">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenAlerts;
