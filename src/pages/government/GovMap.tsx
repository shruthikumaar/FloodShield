import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const sensorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const GovMap: React.FC = () => {
  const { shelters } = useEmergency();
  const center: [number, number] = [12.9716, 77.5946];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div className="map-container" style={{ flex: 1, zIndex: 0 }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Flood Zones (Simulated) */}
          <Circle center={[12.9730, 77.5940]} radius={500} pathOptions={{ color: 'var(--status-flooded)', fillColor: 'var(--status-flooded)', fillOpacity: 0.3 }}>
            <Popup>Affected Area: Ward 12<br/>Depth: 0.82m</Popup>
          </Circle>

          <Circle center={[12.9600, 77.5800]} radius={800} pathOptions={{ color: 'var(--status-caution)', fillColor: 'var(--status-caution)', fillOpacity: 0.3 }}>
            <Popup>Waterlogging Warning</Popup>
          </Circle>

          {/* Sensors */}
          <Marker position={[12.9730, 77.5940]} icon={sensorIcon}>
            <Popup>
              <strong>SENSOR-001</strong><br/>
              Water Level: 0.82 m<br/>
              Rainfall: 65 mm/hr<br/>
              Status: WARNING
            </Popup>
          </Marker>

          <Marker position={[12.9600, 77.5800]} icon={sensorIcon}>
            <Popup>
              <strong>SENSOR-003</strong><br/>
              Water Level: 0.45 m<br/>
              Rainfall: 40 mm/hr<br/>
              Status: CAUTION
            </Popup>
          </Marker>

          {/* Shelters */}
          {shelters.map(shelter => (
            <Marker key={shelter.id} position={[shelter.lat, shelter.lng]}>
              <Popup>
                <strong>{shelter.name}</strong><br/>
                Capacity: {shelter.available} / {shelter.capacity}<br/>
                Status: {shelter.status}
              </Popup>
            </Marker>
          ))}
          
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="card" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, padding: '12px', minWidth: '150px' }}>
        <h4 style={{ marginBottom: '8px', fontSize: '0.875rem' }}>Map Legend</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#2b82cb', borderRadius: '50%' }}></div> SHELTER
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#9c27b0', borderRadius: '50%' }}></div> SENSOR
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--status-flooded)', borderRadius: '50%', opacity: 0.5 }}></div> FLOOD ZONE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--status-caution)', borderRadius: '50%', opacity: 0.5 }}></div> WATERLOGGING
        </div>
      </div>
    </div>
  );
};

export default GovMap;
