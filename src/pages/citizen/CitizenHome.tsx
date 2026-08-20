import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { CloudRain, Wind, Thermometer, Droplets, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGeolocation from '../../hooks/useGeolocation';
import { WeatherWidget } from '../../components/WeatherWidget';
import { H3RiskWidget } from '../../components/H3RiskWidget';
import './CitizenHome.css';

const CitizenHome: React.FC = () => {
  const { currentStatus, weather, alerts } = useEmergency();
  const navigate = useNavigate();
  const location = useGeolocation();
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [liveWeather, setLiveWeather] = useState<any>(null);

  useEffect(() => {
    if (!location.coordinates) return;
    const fetchRisk = async () => {
      try {
        const { lat, lng } = location.coordinates!;
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation,temperature_2m,wind_speed_10m&hourly=temperature_2m,precipitation&timezone=auto`);
        const weatherData = await weatherRes.json();
        const precip = weatherData.current?.precipitation || 0;
        
        if (precip > 15) setLiveStatus('DANGER');
        else if (precip > 2) setLiveStatus('CAUTION');
        else setLiveStatus('SAFE');

        const forecast = [];
        if (weatherData.hourly) {
          const currentHour = new Date().getHours();
          for (let i = 0; i < 4; i++) {
            const idx = currentHour + i;
            if (idx < weatherData.hourly.time.length) {
              forecast.push({
                time: i === 0 ? 'NOW' : new Date(weatherData.hourly.time[idx]).toLocaleTimeString([], { hour: 'numeric' }),
                temp: Math.round(weatherData.hourly.temperature_2m[idx]),
                condition: weatherData.hourly.precipitation[idx] > 2 ? 'Rain' : weatherData.hourly.precipitation[idx] > 0 ? 'Light Rain' : 'Cloudy'
              });
            }
          }
        }

        setLiveWeather({
          rainfall: precip,
          waterLevel: precip > 10 ? 1.5 : precip > 2 ? 0.8 : 0.3, // Estimate based on rain
          temperature: Math.round(weatherData.current?.temperature_2m || 0),
          wind: Math.round(weatherData.current?.wind_speed_10m || 0),
          forecast: forecast.length > 0 ? forecast : weather.forecast
        });
      } catch (e) {
        setLiveStatus(null);
        setLiveWeather(null);
      }
    };
    fetchRisk();
  }, [location.coordinates]);

  const effectiveStatus = liveStatus || currentStatus;
  const displayWeather = liveWeather || weather;

  const getStatusColor = () => {
    switch(effectiveStatus) {
      case 'SAFE': return 'var(--status-safe, #10b981)';
      case 'CAUTION': return 'var(--status-caution, #f59e0b)';
      case 'DANGER': return 'var(--status-danger, #ef4444)';
      case 'FLOODED': return 'var(--status-flooded, #3b82f6)';
      default: return 'var(--status-caution)';
    }
  };

  const getStatusText = () => {
    switch(effectiveStatus) {
      case 'SAFE': return 'Conditions around your location are currently stable. No heavy rainfall detected. Continue your day normally.';
      case 'CAUTION': return 'Heavy rainfall is currently affecting your area. Water levels in nearby drains are being monitored. Avoid low-lying areas.';
      case 'DANGER': return 'Severe conditions detected by satellite. Major flood risk in your immediate vicinity. Be prepared to evacuate.';
      case 'FLOODED': return 'Flooding has affected roads near your location. Follow the recommended route to the nearest available shelter immediately.';
      default: return '';
    }
  };

  const getActionTitle = () => {
    switch(effectiveStatus) {
      case 'SAFE': return 'SAFE ZONE DETECTED';
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
            {effectiveStatus}
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

      {/* H3 Spatial Risk Detection */}
      <div className="mt-4 mb-4">
        <H3RiskWidget lat={location.coordinates?.lat} lng={location.coordinates?.lng} />
      </div>

      {/* Recommendations */}
      <div className="card recommendation-card mt-4 mb-4" style={{ backgroundColor: effectiveStatus === 'SAFE' ? 'var(--status-safe-bg, #ecfdf5)' : 'var(--status-info-bg)', border: effectiveStatus === 'SAFE' ? '1px solid var(--status-safe, #10b981)' : 'none' }}>
        <h3 style={{ color: effectiveStatus === 'SAFE' ? 'var(--status-safe, #10b981)' : 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {effectiveStatus === 'SAFE' ? <MapPin size={20} /> : <AlertTriangle size={20} />}
          {getActionTitle()}
        </h3>
        <p>{getStatusText()}</p>
        
        {effectiveStatus !== 'SAFE' ? (
          <button className="btn btn-primary mt-4" onClick={() => navigate('/app/citizen/route')}>
            VIEW SAFE ROUTE
          </button>
        ) : (
          <button className="btn btn-outline mt-4" onClick={() => navigate('/app/citizen/shelters')}>
            BROWSE NEARBY SHELTERS
          </button>
        )}
      </div>

      {/* Current Conditions */}
      <h3 className="section-title">CURRENT CONDITIONS</h3>
      <div className="dashboard-grid">
        <div className="card condition-card">
          <CloudRain size={24} color="var(--brand-primary)" />
          <div className="condition-value">{displayWeather.rainfall} mm/hr</div>
          <div className="condition-label">RAIN</div>
        </div>
        <div className="card condition-card">
          <Droplets size={24} color="var(--brand-primary)" />
          <div className="condition-value">{displayWeather.waterLevel} m</div>
          <div className="condition-label">WATER LEVEL (EST)</div>
        </div>
        <div className="card condition-card">
          <Thermometer size={24} color="var(--brand-primary)" />
          <div className="condition-value">{displayWeather.temperature}°C</div>
          <div className="condition-label">TEMPERATURE</div>
        </div>
        <div className="card condition-card">
          <Wind size={24} color="var(--brand-primary)" />
          <div className="condition-value">{displayWeather.wind} km/h</div>
          <div className="condition-label">WIND</div>
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="card mb-4">
        <h3>Live Weather Forecast</h3>
        <div className="forecast-grid">
          {displayWeather.forecast.map((item: any, idx: number) => (
            <div key={idx} className="forecast-item">
              <div className="forecast-time">{item.time}</div>
              <CloudRain size={32} color={item.condition.includes('Rain') ? 'var(--status-flooded)' : 'var(--brand-primary)'} />
              <div className="forecast-temp">{item.temp}°C</div>
              <div className="forecast-cond" style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '4px' }}>{item.condition}</div>
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
