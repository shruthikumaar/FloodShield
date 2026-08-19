import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { CloudRain, Wind, Thermometer, Droplets, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGeolocation from '../../hooks/useGeolocation';
import { WeatherWidget } from '../../components/WeatherWidget';
import './CitizenHome.css';

const CitizenHome: React.FC = () => {
  const { currentStatus, weather, alerts } = useEmergency();
  const navigate = useNavigate();
  const location = useGeolocation();

  const getStatusColor = () => {
    switch(currentStatus) {
      case 'SAFE': return 'var(--status-safe)';
      case 'CAUTION': return 'var(--status-caution)';
      case 'DANGER': return 'var(--status-danger)';
      case 'FLOODED': return 'var(--status-flooded)';
      default: return 'var(--status-caution)';
    }
  };

  const getStatusText = () => {
    switch(currentStatus) {
      case 'SAFE': return 'Conditions around your location are currently stable. Continue monitoring alerts.';
      case 'CAUTION': return 'Heavy rainfall is currently affecting your area. Water levels are being monitored.';
      case 'DANGER': return 'Severe conditions detected. Be prepared to evacuate.';
      case 'FLOODED': return 'Flooding has affected roads near your location. Follow the recommended route to the nearest available shelter.';
      default: return '';
    }
  };

  const getActionTitle = () => {
    switch(currentStatus) {
      case 'SAFE': return 'NO IMMEDIATE ACTION REQUIRED';
      case 'CAUTION': return 'STAY ALERT';
      case 'DANGER': return 'PREPARE TO EVACUATE';
      case 'FLOODED': return 'EVACUATION ADVISED';
      default: return 'STAY ALERT';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        
        {/* Main Status Card */}
        <div className="card status-card" style={{ borderTop: `4px solid ${getStatusColor()}` }}>
          <h3>YOUR CURRENT SAFETY STATUS</h3>
          <div className="status-large" style={{ color: getStatusColor() }}>
            {currentStatus}
          </div>
          <p>{getStatusText()}</p>
          <div className="updated-text">Last updated: 2 minutes ago</div>
        </div>

        {/* Location Card */}
        <div className="card location-card">
          <h3>YOUR LIVE LOCATION</h3>
          <div className="location-info">
            <MapPin size={32} color="var(--brand-primary)" />
            <div>
              <div className="location-name">
                {location.loaded 
                  ? (location.coordinates ? "GPS Active" : "Location access denied")
                  : "Detecting area..."}
              </div>
              <div className="location-coords">
                {location.coordinates 
                  ? `Lat: ${location.coordinates.lat.toFixed(4)}, Lng: ${location.coordinates.lng.toFixed(4)}`
                  : 'Waiting for coordinates...'}
              </div>
              <div className={`badge ${location.coordinates ? 'badge-safe' : 'badge-caution'} mt-2`}>
                {location.loaded ? 'Location detected' : 'Detecting...'}
              </div>
            </div>
          </div>
          <button className="btn btn-outline w-full mt-4" onClick={() => navigate('/app/citizen/map')}>
            View on Live Map
          </button>
        </div>

        {/* Real-time Weather Widget */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
           <WeatherWidget lat={location.coordinates?.lat} lng={location.coordinates?.lng} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="card recommendation-card mt-4 mb-4" style={{ backgroundColor: 'var(--status-info-bg)', border: 'none' }}>
        <h3>{getActionTitle()}</h3>
        <p>{getStatusText()}</p>
        <button className="btn btn-primary" onClick={() => navigate('/app/citizen/route')}>
          VIEW SAFE ROUTE
        </button>
      </div>

      {/* Current Conditions */}
      <h3 className="section-title">CURRENT CONDITIONS</h3>
      <div className="dashboard-grid">
        <div className="card condition-card">
          <CloudRain size={24} color="var(--brand-primary)" />
          <div className="condition-value">{weather.rainfall} mm/hr</div>
          <div className="condition-label">RAIN</div>
        </div>
        <div className="card condition-card">
          <Droplets size={24} color="var(--brand-primary)" />
          <div className="condition-value">{weather.waterLevel} m</div>
          <div className="condition-label">WATER LEVEL</div>
        </div>
        <div className="card condition-card">
          <Thermometer size={24} color="var(--brand-primary)" />
          <div className="condition-value">{weather.temperature}°C</div>
          <div className="condition-label">TEMPERATURE</div>
        </div>
        <div className="card condition-card">
          <Wind size={24} color="var(--brand-primary)" />
          <div className="condition-value">{weather.wind} km/h</div>
          <div className="condition-label">WIND</div>
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="card mb-4">
        <h3>Weather & Rain Forecast</h3>
        <div className="forecast-grid">
          {weather.forecast.map((item, idx) => (
            <div key={idx} className="forecast-item">
              <div className="forecast-time">{item.time}</div>
              <CloudRain size={32} color="var(--brand-primary)" />
              <div className="forecast-temp">{item.temp}°C</div>
              <div className="forecast-cond">{item.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="alerts-section">
        <div className="flex justify-between items-center mb-4">
          <h3>Active Alerts</h3>
          <button className="btn btn-outline" onClick={() => navigate('/app/citizen/alerts')}>View All</button>
        </div>
        <div className="flex flex-col gap-4">
          {alerts.slice(0,3).map(alert => (
            <div key={alert.id} className="card alert-card flex gap-4 items-center">
              <AlertTriangle size={24} color={alert.type === 'URGENT' ? 'var(--status-danger)' : 'var(--status-caution)'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{alert.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{alert.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenHome;
