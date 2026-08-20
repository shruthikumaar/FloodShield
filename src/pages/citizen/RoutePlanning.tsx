import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEmergency, ShelterData } from '../../context/EmergencyContext';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { ShieldAlert, Navigation, AlertTriangle, MapPin, Loader2, History } from 'lucide-react';
import useGeolocation from '../../hooks/useGeolocation';
import L from 'leaflet';

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
const fullShelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

// Helper component to auto-recenter map on location load
const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Helper component to auto-fit map bounds to a calculated route
const MapBoundsFitter = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      // Pad the right side by 400px to account for the Route Info Panel overlay
      map.fitBounds(bounds, { padding: [50, 50], paddingBottomRight: [400, 50] });
    }
  }, [positions, map]);
  return null;
};

interface RouteDetails {
  polyline: [number, number][];
  distanceKm: number;
  durationMin: number;
  instructions: string[];
}

const RoutePlanning: React.FC = () => {
  const { state } = useLocation();
  const { shelters, currentStatus, fetchDynamicShelters, isFetchingShelters } = useEmergency();
  const location = useGeolocation();
  
  const [selectedShelter, setSelectedShelter] = useState<ShelterData | null>(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [routeUpdatedMsg, setRouteUpdatedMsg] = useState(false);
  
  // Real routing states
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);
  const [liveRouteData, setLiveRouteData] = useState<{ primary: RouteDetails, alternate?: RouteDetails } | null>(null);

  const center: [number, number] = (location.loaded && location.coordinates) 
    ? [location.coordinates.lat, location.coordinates.lng] 
    : [12.9716, 77.5946];

  // Fetch shelters if none exist and we have coordinates
  useEffect(() => {
    if (location.loaded && location.coordinates && shelters.length === 0 && !isFetchingShelters) {
      fetchDynamicShelters(location.coordinates.lat, location.coordinates.lng);
    }
  }, [location.loaded, location.coordinates, shelters.length, isFetchingShelters, fetchDynamicShelters]);

  // Handle pre-selected shelter passed via router state
  useEffect(() => {
    if (state?.shelterId) {
      const shelter = shelters.find(s => s.id === state.shelterId);
      if (shelter) {
        setSelectedShelter(shelter);
        setRouteCalculated(true);
      }
    }
  }, [state, shelters]);

  useEffect(() => {
    if (routeCalculated && (currentStatus === 'FLOODED' || currentStatus === 'EVACUATE')) {
      setRouteUpdatedMsg(true);
    }
  }, [currentStatus, routeCalculated]);

  // Fetch real routes from OSRM when route calculation is requested
  useEffect(() => {
    const fetchOSRMRoute = async () => {
      if (!selectedShelter || !location.coordinates) return;
      
      setIsFetchingRoute(true);
      try {
        const startLng = location.coordinates.lng;
        const startLat = location.coordinates.lat;
        const endLng = selectedShelter.lng;
        const endLat = selectedShelter.lat;
        
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true&alternatives=true`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const mapRoute = (route: any): RouteDetails => {
            const polyline = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
            const distanceKm = route.distance / 1000;
            const durationMin = route.duration / 60;
            
            const instructions = route.legs[0]?.steps?.map((step: any) => {
              const type = step.maneuver.type;
              const modifier = step.maneuver.modifier ? ` ${step.maneuver.modifier}` : '';
              const roadName = step.name ? ` onto ${step.name}` : '';
              
              if (type === 'depart') return 'Start from your current location';
              if (type === 'arrive') return `Arrive at ${selectedShelter.name}`;
              return `${type.charAt(0).toUpperCase() + type.slice(1)}${modifier}${roadName}`;
            }).filter(Boolean) || [];

            return { polyline, distanceKm, durationMin, instructions };
          };

          setLiveRouteData({
            primary: mapRoute(data.routes[0]),
            alternate: data.routes.length > 1 ? mapRoute(data.routes[1]) : undefined
          });
        }
      } catch (error) {
        console.error("Failed to fetch OSRM route:", error);
      } finally {
        setIsFetchingRoute(false);
      }
    };

    if (routeCalculated) {
      fetchOSRMRoute();
    }
  }, [routeCalculated, selectedShelter, location.coordinates]);

  const handleStartNavigation = () => {
    if (selectedShelter && location.coordinates) {
      const origin = `${location.coordinates.lat},${location.coordinates.lng}`;
      const destination = `${selectedShelter.lat},${selectedShelter.lng}`;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleBuildRoute = (shelter: ShelterData) => {
    setSelectedShelter(shelter);
    setRouteCalculated(true);
  };

  const activeRouteDetails = (routeUpdatedMsg && liveRouteData?.alternate) ? liveRouteData.alternate : liveRouteData?.primary;
  const floodedRoutePart = routeUpdatedMsg && liveRouteData?.alternate ? liveRouteData.primary.polyline : [];

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      
      {/* Top Bar Status */}
      <div style={{ padding: '12px 24px', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Interactive Shelter Map</h2>
        <div className="flex gap-4">
          {isFetchingShelters && (
            <div className="flex items-center gap-2" style={{ color: 'var(--brand-primary)', fontSize: '0.875rem' }}>
              <Loader2 className="spinner" size={16} />
              Scanning for active shelters...
            </div>
          )}
          {isFetchingRoute && (
            <div className="flex items-center gap-2" style={{ color: 'var(--brand-primary)', fontSize: '0.875rem' }}>
              <Loader2 className="spinner" size={16} />
              Calculating live route...
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', height: '100%', flex: 1, position: 'relative' }}>
        {/* Map Area */}
        <div className="map-container" style={{ flex: 1, zIndex: 1 }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* Only recenter on user location if we don't have a route. Otherwise, fit to route. */}
            {(!selectedShelter || !routeCalculated || !activeRouteDetails) && <MapRecenter center={center} />}
            {selectedShelter && routeCalculated && activeRouteDetails && (
              <MapBoundsFitter positions={activeRouteDetails?.polyline || liveRouteData?.primary?.polyline || []} />
            )}
            
            {location.loaded && location.coordinates && (
              <Marker position={[location.coordinates.lat, location.coordinates.lng]} icon={userIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Render dynamically fetched shelters */}
            {shelters.map(shelter => (
              <Marker 
                key={shelter.id} 
                position={[shelter.lat, shelter.lng]} 
                icon={shelter.status === 'FULL' ? fullShelterIcon : shelterIcon}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '220px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{shelter.name}</h4>
                    
                    {shelter.isHistoricallySafe && (
                      <div style={{ marginBottom: '8px', backgroundColor: 'var(--status-caution-bg, #fef3c7)', color: 'var(--status-caution, #d97706)', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        <History size={10} />
                        Frequently Used Safe Zone
                      </div>
                    )}
                    
                    <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                      <strong>Status:</strong> <span style={{ color: shelter.status === 'FULL' ? 'var(--status-danger)' : 'var(--status-safe)', fontWeight: 600 }}>{shelter.status}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                      <strong>Distance:</strong> {shelter.distance} km
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
                      <strong>Capacity:</strong> {shelter.available} available
                    </div>
                    
                    {shelter.status !== 'FULL' && (
                      <button 
                        className="btn btn-primary w-full"
                        style={{ padding: '8px', fontSize: '0.875rem' }}
                        onClick={() => handleBuildRoute(shelter)}
                        disabled={!location.coordinates || isFetchingRoute}
                      >
                        <Navigation size={14} style={{ marginRight: '6px', display: 'inline-block' }} />
                        {isFetchingRoute ? 'Calculating...' : 'Build Live Route'}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Render live OSRM route lines */}
            {selectedShelter && routeCalculated && liveRouteData && (
              <>
                {routeUpdatedMsg && liveRouteData.alternate && (
                  <Polyline positions={floodedRoutePart} color="var(--status-danger)" weight={6} dashArray="10, 10" opacity={0.6} />
                )}
                <Polyline positions={activeRouteDetails?.polyline || liveRouteData.primary.polyline} color="var(--brand-primary)" weight={5} opacity={0.9} />
              </>
            )}
          </MapContainer>
        </div>

        {/* Route Info Panel Overlay */}
        {selectedShelter && routeCalculated && activeRouteDetails && (
          <div className="card" style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            width: '380px', 
            zIndex: 1000, 
            borderRadius: 0, 
            borderTop: 'none', 
            borderBottom: 'none', 
            borderRight: 'none', 
            display: 'flex', 
            flexDirection: 'column',
            margin: 0,
            overflowY: 'auto',
            boxShadow: '-4px 0 15px rgba(0,0,0,0.1)'
          }}>
            <div className="badge badge-safe mb-4" style={{ alignSelf: 'flex-start' }}>LIVE ROUTE CALCULATED</div>
            <h2 style={{ marginBottom: '4px' }}>{selectedShelter.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.875rem' }}>
              Capacity: {selectedShelter.available} spaces available. <br/>Facilities: {selectedShelter.facilities.join(', ')}
            </p>

            {routeUpdatedMsg && liveRouteData?.alternate && (
              <div style={{ backgroundColor: 'var(--status-danger-bg)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--status-danger)' }}>
                <h4 style={{ color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={20} /> ROUTE UPDATED
                </h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Flooding detected on original route. Rerouting via safe path.</p>
                <button className="btn btn-primary w-full" style={{ backgroundColor: 'var(--status-danger)' }} onClick={() => setRouteUpdatedMsg(false)}>
                  VIEW ORIGINAL ROUTE
                </button>
              </div>
            )}

            <h3>RECOMMENDED EVACUATION ROUTE</h3>
            
            <div className="flex justify-between mb-4 mt-4">
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACTUAL DISTANCE</div>
                <div style={{ fontWeight: 600 }}>{activeRouteDetails.distanceKm.toFixed(1)} km</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EST. TIME (TRAFFIC)</div>
                <div style={{ fontWeight: 600 }}>{Math.round(activeRouteDetails.durationMin)} min</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ROAD CONDITION</div>
              <div className="badge badge-safe mt-1">{routeUpdatedMsg ? 'ALTERNATE SAFE' : 'SAFE'}</div>
            </div>

            <div style={{ flex: 1, borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>LIVE INSTRUCTIONS</h4>
              <ol style={{ paddingLeft: '20px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-primary)' }}>
                {activeRouteDetails.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button 
                className="btn btn-primary w-full" 
                style={{ padding: '16px', fontSize: '1rem', marginBottom: '12px' }}
                onClick={handleStartNavigation}
              >
                <Navigation size={20} style={{ marginRight: '8px' }} />
                START GPS NAVIGATION
              </button>
              
              <button 
                className="btn btn-outline w-full" 
                onClick={() => {
                  setSelectedShelter(null);
                  setRouteCalculated(false);
                  setRouteUpdatedMsg(false);
                  setLiveRouteData(null);
                }}
              >
                Cancel Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanning;
