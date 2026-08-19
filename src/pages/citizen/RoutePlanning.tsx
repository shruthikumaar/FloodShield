import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEmergency, ShelterData } from '../../context/EmergencyContext';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { ShieldAlert, Navigation, AlertTriangle, MapPin } from 'lucide-react';
import L from 'leaflet';

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const RoutePlanning: React.FC = () => {
  const { state } = useLocation();
  const { shelters, currentStatus } = useEmergency();
  const navigate = useNavigate();
  
  const [selectedShelter, setSelectedShelter] = useState<ShelterData | null>(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [routeUpdatedMsg, setRouteUpdatedMsg] = useState(false);

  useEffect(() => {
    if (state?.shelterId) {
      const shelter = shelters.find(s => s.id === state.shelterId);
      if (shelter) {
        setSelectedShelter(shelter);
      }
    }
  }, [state, shelters]);

  useEffect(() => {
    if (routeCalculated && (currentStatus === 'FLOODED' || currentStatus === 'EVACUATE')) {
      setRouteUpdatedMsg(true);
    }
  }, [currentStatus, routeCalculated]);

  const center: [number, number] = [12.9716, 77.5946];
  
  // Safe Route Mock
  const safeRoute: [number, number][] = selectedShelter ? [
    center,
    [12.9700, 77.5970],
    [selectedShelter.lat, selectedShelter.lng]
  ] : [];

  // Flooded Route Alternative Mock
  const alternateRoute: [number, number][] = selectedShelter ? [
    center,
    [12.9750, 77.5900],
    [12.9780, 77.5950],
    [selectedShelter.lat, selectedShelter.lng]
  ] : [];

  const activeRoute = routeUpdatedMsg ? alternateRoute : safeRoute;
  const floodedRoutePart: [number, number][] = routeUpdatedMsg ? [
    center,
    [12.9700, 77.5970] // old path which is now flooded
  ] : [];

  if (!selectedShelter) {
    return (
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        <h2 className="mb-4">Choose Safe Destination</h2>
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin color="var(--brand-primary)" />
            <strong>Your Current Location</strong>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Detecting area...</div>
        </div>
        
        <h3 className="mb-4 text-center">↓</h3>

        <div className="flex flex-col gap-4">
          {shelters.filter(s => s.status !== 'FULL').map(shelter => (
            <div key={shelter.id} className="card flex justify-between items-center cursor-pointer hover:border-primary" 
                 onClick={() => setSelectedShelter(shelter)}
                 style={{ border: '1px solid var(--border-color)' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} color="var(--brand-primary)" />
                  {shelter.name}
                </h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Distance: {shelter.distance} km | Available: {shelter.available}
                </div>
              </div>
              <button className="btn btn-outline">Select</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      
      {!routeCalculated ? (
        <div className="dashboard-container" style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
          <div className="card">
            <div className="badge badge-safe mb-4">DESTINATION SELECTED</div>
            <h2>{selectedShelter.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Capacity: {selectedShelter.available} spaces available. Facilities: {selectedShelter.facilities.join(', ')}
            </p>
            <button className="btn btn-primary w-full" onClick={() => setRouteCalculated(true)} style={{ padding: '12px' }}>
              CALCULATE SAFEST ROUTE
            </button>
            <button className="btn btn-outline w-full mt-4" onClick={() => setSelectedShelter(null)}>
              Change Destination
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100%', flex: 1, position: 'relative' }}>
          {/* Map Area */}
          <div className="map-container" style={{ flex: 1 }}>
            <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={center} icon={userIcon}><Popup>Start</Popup></Marker>
              <Marker position={[selectedShelter.lat, selectedShelter.lng]} icon={shelterIcon}><Popup>Destination</Popup></Marker>
              
              {routeUpdatedMsg && (
                <Polyline positions={floodedRoutePart} color="var(--status-flooded)" weight={5} dashArray="10, 10" />
              )}
              <Polyline positions={activeRoute} color="var(--brand-primary)" weight={6} opacity={0.8} />
            </MapContainer>
          </div>

          {/* Route Info Panel */}
          <div className="card" style={{ width: '350px', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderRight: 'none', display: 'flex', flexDirection: 'column' }}>
            
            {routeUpdatedMsg && (
              <div style={{ backgroundColor: 'var(--status-danger-bg)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--status-danger)' }}>
                <h4 style={{ color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={20} /> ROUTE UPDATED
                </h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Flooding has been detected on your current route.</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-danger)', marginBottom: '4px' }}>STATUS: BLOCKED (Lake Road)</div>
                <button className="btn btn-primary w-full" style={{ backgroundColor: 'var(--status-danger)' }} onClick={() => setRouteUpdatedMsg(false)}>
                  VIEW NEW ROUTE
                </button>
              </div>
            )}

            <h3>RECOMMENDED EVACUATION ROUTE</h3>
            
            <div className="flex justify-between mb-4 mt-4">
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DISTANCE</div>
                <div style={{ fontWeight: 600 }}>{routeUpdatedMsg ? '3.2 km' : '2.4 km'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EST. TIME</div>
                <div style={{ fontWeight: 600 }}>{routeUpdatedMsg ? '12 min' : '8 min'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ROAD CONDITION</div>
              <div className="badge badge-safe mt-1">SAFE</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>INSTRUCTIONS</h4>
              <ol style={{ paddingLeft: '20px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Continue straight from current location</li>
                {routeUpdatedMsg ? (
                  <>
                    <li>Turn left to avoid Main Road (Flooded)</li>
                    <li>Continue on 2nd Cross for 1.2 km</li>
                  </>
                ) : (
                  <>
                    <li>Turn left at Main Road</li>
                    <li>Continue for 800 m</li>
                  </>
                )}
                <li>Turn right toward {selectedShelter.name}</li>
                <li>Shelter entrance ahead</li>
              </ol>
            </div>

            <button className="btn btn-primary w-full mt-4" style={{ padding: '16px', fontSize: '1rem' }}>
              <Navigation size={20} style={{ marginRight: '8px' }} />
              START NAVIGATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanning;
