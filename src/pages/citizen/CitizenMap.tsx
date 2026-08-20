import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useGeolocation from '../../hooks/useGeolocation';

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

const fullShelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const safeZoneIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
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

// Helper component to update map center dynamically
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const CitizenMap: React.FC = () => {
  const { shelters, currentStatus, fetchDynamicShelters, isFetchingShelters } = useEmergency();
  const navigate = useNavigate();
  const location = useGeolocation();
  
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const center: [number, number] = (location.loaded && location.coordinates)
    ? [location.coordinates.lat, location.coordinates.lng] 
    : defaultCenter;

  useEffect(() => {
    if (location.loaded && location.coordinates && shelters.length === 0 && !isFetchingShelters) {
      fetchDynamicShelters(location.coordinates.lat, location.coordinates.lng);
    }
  }, [location.loaded, location.coordinates, shelters.length, isFetchingShelters, fetchDynamicShelters]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div className="map-container" style={{ flex: 1, zIndex: 0 }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <MapUpdater center={center} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location */}
          <Marker position={center} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Shelters */}
          {shelters.map(shelter => {
            let markerIcon = shelterIcon;
            if (shelter.status === 'FULL') markerIcon = fullShelterIcon;
            else if (shelter.isHistoricallySafe) markerIcon = safeZoneIcon;

            return (
              <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={markerIcon}>
                <Popup>
                  <strong>{shelter.name}</strong><br/>
                  Capacity: {shelter.available} / {shelter.capacity}<br/>
                  Status: {shelter.status}
                  {shelter.isHistoricallySafe && <div style={{color: '#d97706', fontSize: '0.8rem', marginTop: '4px'}}>Frequently Used Safe Zone</div>}
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>
      </div>

      {/* Legend */}
      <div className="card" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, padding: '16px', minWidth: '180px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Map Legend</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#2b82cb', borderRadius: '50%' }}></div> Your Location
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#2aad27', borderRadius: '50%' }}></div> Active Shelter
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#cb2b3e', borderRadius: '50%' }}></div> Full / Closed Shelter
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#cb8427', borderRadius: '50%' }}></div> Historical Safe Zone
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--status-safe)' }}></div> Safe Evacuation Route
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.8rem' }}>
          <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--status-flooded)', borderBottom: '2px dashed white' }}></div> Waterlogged / Flooded
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="card" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600 }}>YOUR LOCATION</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {location.loaded 
              ? (location.coordinates ? "Live location detected" : "Location access denied")
              : "Detecting location..."}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/citizen/shelters')}>
          Find Safe Shelter
        </button>
      </div>
    </div>
  );
};

export default CitizenMap;
