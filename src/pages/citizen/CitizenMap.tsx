import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CitizenMap: React.FC = () => {
  const { shelters, currentStatus } = useEmergency();
  const navigate = useNavigate();
  const center: [number, number] = [12.9716, 77.5946];

  // Mock route based on status
  const safeRoute: [number, number][] = [
    [12.9716, 77.5946],
    [12.9720, 77.5950],
    [12.9700, 77.5970],
    [12.9650, 77.5850] // To Town Hall
  ];

  const floodedRoute: [number, number][] = [
    [12.9716, 77.5946],
    [12.9730, 77.5940],
    [12.9750, 77.5920]
  ];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div className="map-container" style={{ flex: 1, zIndex: 0 }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location */}
          <Marker position={center} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Shelters */}
          {shelters.map(shelter => (
            <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={shelterIcon}>
              <Popup>
                <strong>{shelter.name}</strong><br/>
                Capacity: {shelter.available} / {shelter.capacity}<br/>
                Status: {shelter.status}
              </Popup>
            </Marker>
          ))}

          {/* Routes/Roads */}
          <Polyline positions={safeRoute} color="var(--status-safe)" weight={5} opacity={0.8} />
          {currentStatus === 'FLOODED' || currentStatus === 'EVACUATE' ? (
             <Polyline positions={floodedRoute} color="var(--status-flooded)" weight={5} opacity={0.8} dashArray="10, 10" />
          ) : null}
          
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="card" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, padding: '12px', minWidth: '150px' }}>
        <h4 style={{ marginBottom: '8px', fontSize: '0.875rem' }}>Map Legend</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--brand-primary)', borderRadius: '50%' }}></div> YOUR LOCATION
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--status-safe)', borderRadius: '50%' }}></div> SHELTER
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--status-safe)' }}></div> SAFE ROAD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--status-flooded)' }}></div> FLOODED ROAD
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="card" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600 }}>YOUR LOCATION</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current location detected</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/citizen/shelters')}>
          Find Safe Shelter
        </button>
      </div>
    </div>
  );
};

export default CitizenMap;
