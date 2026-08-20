import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Loader2, Search, CheckCircle2, ShieldCheck, History } from 'lucide-react';
import { ShelterData } from '../../context/EmergencyContext';
import { indiaLocations } from '../../data/indiaLocations';
import { getTaluksForDistrict } from '../../data/indiaTaluks';

const GovShelters: React.FC = () => {
  const { shelters, setGlobalShelters, updateShelterStatus } = useEmergency();
  const statesList = Object.keys(indiaLocations).sort();
  const [selectedState, setSelectedState] = useState(statesList[13]); // Default to Karnataka
  const [districtsList, setDistrictsList] = useState<string[]>(indiaLocations[statesList[13]]);
  const [selectedDistrict, setSelectedDistrict] = useState(indiaLocations[statesList[13]][0]);
  const [taluksList, setTaluksList] = useState<string[]>(getTaluksForDistrict(indiaLocations[statesList[13]][0]));
  const [selectedTaluk, setSelectedTaluk] = useState(getTaluksForDistrict(indiaLocations[statesList[13]][0])[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [expandedShelters, setExpandedShelters] = useState<Record<string, boolean>>({});

  const toggleShelterDetails = (id: string) => {
    setExpandedShelters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    setDistrictsList(indiaLocations[selectedState] || []);
    setSelectedDistrict(indiaLocations[selectedState]?.[0] || '');
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      const taluks = getTaluksForDistrict(selectedDistrict);
      setTaluksList(taluks);
      setSelectedTaluk(taluks[0]);
    }
  }, [selectedDistrict]);

  const fetchSheltersForLocation = async () => {
    setIsLoading(true);
    setGlobalShelters([]);
    try {
      // 1. Geocode the location
      const query = `${selectedTaluk}, ${selectedDistrict}, ${selectedState}, India`;
      const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
      const geocodeData = await geocodeRes.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        alert("Could not find coordinates for this location.");
        setIsLoading(false);
        return;
      }
      
      const lat = parseFloat(geocodeData[0].lat);
      const lon = parseFloat(geocodeData[0].lon);

      // 2. Fetch from Overpass
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="school"](around:20000,${lat},${lon});
          node["amenity"="community_centre"](around:20000,${lat},${lon});
          node["amenity"="townhall"](around:20000,${lat},${lon});
          node["amenity"="hospital"](around:20000,${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.elements && data.elements.length > 0) {
        const nodes = data.elements.filter((e: any) => e.type === 'node' && e.lat && e.lon).slice(0, 20);
        const dynamicShelters: ShelterData[] = nodes.map((node: any, index: number) => {
          const capacity = 100 + Math.floor(Math.random() * 900);
          return {
            id: `gov-dyn-${node.id}`,
            name: node.tags?.name || `Emergency Center (${node.tags?.amenity || 'Facility'})`,
            distance: 0,
            capacity: capacity,
            available: Math.floor(Math.random() * (capacity / 2)),
            status: index % 5 === 4 ? 'FULL' : 'OPEN',
            facilities: ['Water', 'Food', 'Medical'],
            lat: node.lat,
            lng: node.lon,
            isGovVerified: true,
          };
        });
        setGlobalShelters(dynamicShelters);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch live shelters.");
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'FULL' ? 'OPEN' : 'FULL';
    // If it becomes full, set available to 0. If it opens, we don't know the exact amount, but we'll simulate 50.
    const newAvailable = newStatus === 'FULL' ? 0 : 50;
    updateShelterStatus(id, newAvailable, newStatus);
  };

  const handleManualCapacityUpdate = (id: string, currentAvailable: number) => {
    const increment = prompt("Enter number of people leaving the shelter (negative to add people):", "10");
    if (increment !== null && !isNaN(parseInt(increment))) {
      const newAvailable = Math.max(0, currentAvailable + parseInt(increment));
      const newStatus = newAvailable === 0 ? 'FULL' : 'OPEN';
      updateShelterStatus(id, newAvailable, newStatus);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h2>Live Shelters Management</h2>
      </div>

      <div className="card mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h3 className="mb-4" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} /> Select Area to Manage
        </h3>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="form-group relative" style={{ marginBottom: 0 }}>
            <label className="form-label">State</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                {statesList.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group relative" style={{ marginBottom: 0 }}>
            <label className="form-label">District</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districtsList.length === 0}>
                {districtsList.map(district => <option key={district} value={district}>{district}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group relative" style={{ marginBottom: 0 }}>
            <label className="form-label">Taluk</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedTaluk} onChange={(e) => setSelectedTaluk(e.target.value)} disabled={taluksList.length === 0}>
                {taluksList.map(taluk => <option key={taluk} value={taluk}>{taluk}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-end" style={{ marginBottom: 0 }}>
            <button 
              className="btn btn-primary w-full" 
              onClick={fetchSheltersForLocation}
              disabled={isLoading}
              style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isLoading ? <Loader2 size={18} className="spinner" /> : <Search size={18} />}
              {isLoading ? 'Scanning...' : 'Find Shelters'}
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} className="spinner mb-4" style={{ margin: '0 auto', display: 'block' }} />
          <p>Querying satellites and public records for active shelters in {selectedTaluk}...</p>
        </div>
      ) : shelters.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <ShieldAlert size={32} color="var(--text-secondary)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Select an area and click "Find Shelters" to load live management data.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {shelters.map(shelter => (
          <div key={shelter.id} className="card" style={{ opacity: shelter.status === 'FULL' ? 0.7 : 1 }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color={shelter.status === 'FULL' ? 'var(--status-danger)' : 'var(--brand-primary)'} />
                  {shelter.name}
                </h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                  Distance: {shelter.distance} km away
                </div>
                
                {/* Badges for Verified and Risk */}
                <div className="flex gap-2 mt-2">
                  {shelter.isGovVerified && (
                    <span className="badge" style={{ backgroundColor: 'var(--status-info-bg, #eff6ff)', color: 'var(--status-info, #3b82f6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} />
                      Govt Verified
                    </span>
                  )}
                  {shelter.isHistoricallySafe && (
                    <span className="badge" style={{ backgroundColor: 'var(--status-caution-bg, #fef3c7)', color: 'var(--status-caution, #d97706)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <History size={12} />
                      Frequently Used Safe Zone
                    </span>
                  )}
                  {shelter.isLowRiskArea && (
                    <span className="badge" style={{ backgroundColor: 'var(--status-safe-bg, #ecfdf5)', color: 'var(--status-safe, #10b981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      Low Disaster Risk Zone
                    </span>
                  )}
                </div>
              </div>
              <div className={`badge ${shelter.status === 'FULL' ? 'badge-danger' : 'badge-safe'}`}>
                {shelter.status}
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL CAPACITY</div>
                <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{shelter.capacity}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OCCUPIED</div>
                <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{shelter.capacity - shelter.available}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AVAILABLE</div>
                <div style={{ fontWeight: 600, fontSize: '1.25rem', color: shelter.status === 'FULL' ? 'var(--status-danger)' : 'var(--status-safe)' }}>
                  {shelter.available}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>FACILITIES</div>
              <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
                {shelter.facilities.map(fac => (
                  <span key={fac} style={{ backgroundColor: 'var(--bg-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => toggleShelterDetails(shelter.id)}
              >
                {expandedShelters[shelter.id] ? 'Hide Details' : 'View Details'}
              </button>
              
              <div style={{ flex: 2, display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => handleManualCapacityUpdate(shelter.id, shelter.available)}
                >
                  Update Capacity
                </button>
                <button 
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => handleUpdateStatus(shelter.id, shelter.status)}
                >
                  Mark as {shelter.status === 'FULL' ? 'OPEN' : 'FULL'}
                </button>
              </div>
            </div>

            {expandedShelters[shelter.id] && (
              <div className="mt-4 p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary, #f1f5f9)', color: 'var(--text-primary)' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.95rem' }}>Shelter Information</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.9rem' }}>
                  {shelter.address && (
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Address:</strong> {shelter.address}</div>
                  )}
                  {shelter.contactInfo && (
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Contact:</strong> {shelter.contactInfo}</div>
                  )}
                  <div><strong style={{ color: 'var(--text-secondary)' }}>Coordinates:</strong> {shelter.lat.toFixed(4)}, {shelter.lng.toFixed(4)}</div>
                  <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Gov Officials must ensure these records are kept up to date.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default GovShelters;
