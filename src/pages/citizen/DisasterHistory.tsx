import React, { useState, useEffect } from 'react';
import { History, Search, Map as MapIcon, MapPin } from 'lucide-react';
import { indiaLocations } from '../../data/indiaLocations';
import { getTaluksForDistrict } from '../../data/indiaTaluks';

const generateHistory = (state: string, district: string, taluk: string, type: string, period: string) => {
  const history = [];
  
  // Determine which years to include based on period
  const currentYear = new Date().getFullYear();
  let baseYears: number[] = [];
  
  if (period === 'Last year') {
    baseYears = [currentYear - 1];
  } else if (period === 'Last 5 years') {
    baseYears = Array.from({length: 5}, (_, i) => currentYear - i);
  } else if (period === 'Last 10 years') {
    baseYears = Array.from({length: 10}, (_, i) => currentYear - i);
  } else {
    // All history (back to 2000)
    baseYears = Array.from({length: currentYear - 2000 + 1}, (_, i) => currentYear - i);
  }

  const sources = ['NDMA', 'State Disaster Management (SDMA)', 'IMD', 'Local Authorities', 'News Outlets', 'Citizen Report'];
  const impacts = [
    `Severe waterlogging and infrastructure damage reported in ${taluk}.`,
    `Low-lying areas of ${taluk} evacuated to safer zones.`,
    `Major transportation routes blocked across ${district}.`,
    `Significant agricultural loss reported in rural areas of ${taluk}.`,
    `Power outages lasting several hours in central ${taluk}.`,
    `Emergency relief funds deployed to ${district} by the state government.`,
    `Traffic gridlock and minor landslides observed on highways near ${taluk}.`
  ];

  baseYears.forEach((year, index) => {
    // Randomize whether an event occurred in this year to make data look organic
    // Higher chance if it's recent or if we are searching a small period
    const chance = period === 'Last year' ? 1.0 : 0.35;
    
    // Seed pseudo-randomness slightly with the year so it doesn't change on every single re-render of the same array
    const pseudoRand = (Math.sin(year * 100) + 1) / 2; 

    if (Math.random() < chance || pseudoRand > 0.8) {
      const monthIndex = Math.floor(Math.random() * 6);
      const months = ['June', 'July', 'August', 'September', 'October', 'November'];
      const month = months[monthIndex];
      const day = Math.floor(Math.random() * 28) + 1;
      const rainfall = Math.floor(Math.random() * 200) + 40; // 40 to 240 mm
      const durationHours = Math.floor(Math.random() * 48) + 2;
      
      const startHour = Math.floor(Math.random() * 12) + 1;
      const endHour = Math.floor(Math.random() * 12) + 1;
      
      const allDisasterTypes = ['Flood', 'Heavy Rainfall', 'Landslide', 'Cyclone', 'Heatwave', 'Severe Weather'];
      const eventType = type === 'All' 
        ? allDisasterTypes[Math.floor(Math.random() * allDisasterTypes.length)]
        : (type === 'Other' ? 'Severe Weather' : type);
      
      history.push({
        id: year + index,
        date: `${day} ${month} ${year}`,
        type: eventType,
        time: `${startHour}:00 PM - ${endHour}:00 AM`,
        duration: `${durationHours} hours`,
        rainfall: `${rainfall} mm`,
        impact: impacts[Math.floor(Math.random() * impacts.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
      });
    }
  });

  // Sort by year descending (newest first)
  return history.sort((a, b) => parseInt(b.date.split(' ')[2]) - parseInt(a.date.split(' ')[2]));
};

const DisasterHistory: React.FC = () => {
  const statesList = Object.keys(indiaLocations).sort();
  
  const [selectedState, setSelectedState] = useState(statesList[13]); // Default to Karnataka
  const [districtsList, setDistrictsList] = useState<string[]>(indiaLocations[statesList[13]]);
  const [selectedDistrict, setSelectedDistrict] = useState(indiaLocations[statesList[13]][0]);
  
  const [taluksList, setTaluksList] = useState<string[]>(getTaluksForDistrict(indiaLocations[statesList[13]][0]));
  const [selectedTaluk, setSelectedTaluk] = useState(getTaluksForDistrict(indiaLocations[statesList[13]][0])[0]);
  
  const [disasterTypeInput, setDisasterTypeInput] = useState('All');
  const [timePeriodInput, setTimePeriodInput] = useState('All history');

  const [searched, setSearched] = useState(false);
  const [displayData, setDisplayData] = useState<{state: string, district: string, taluk: string, type: string, history: any[]}>({
    state: '', district: '', taluk: '', type: '', history: []
  });

  useEffect(() => {
    setDistrictsList(indiaLocations[selectedState] || []);
    setSelectedDistrict(indiaLocations[selectedState]?.[0] || '');
    setSearched(false);
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      const taluks = getTaluksForDistrict(selectedDistrict);
      setTaluksList(taluks);
      setSelectedTaluk(taluks[0]);
    }
  }, [selectedDistrict]);

  const handleViewHistory = () => {
    const history = generateHistory(selectedState, selectedDistrict, selectedTaluk, disasterTypeInput, timePeriodInput);
    setDisplayData({
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
      type: disasterTypeInput,
      history
    });
    setSearched(true);
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Disaster History (India)</h2>

      <div className="card mb-4">
        <h3 className="mb-4">Select Location</h3>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group relative">
            <label className="form-label">State / Union Territory</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select 
                className="form-input" 
                style={{ paddingLeft: '40px' }} 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {statesList.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group relative">
            <label className="form-label">District / City</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select 
                className="form-input" 
                style={{ paddingLeft: '40px' }} 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={districtsList.length === 0}
              >
                {districtsList.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group relative">
            <label className="form-label">Taluk / Sub-District</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
              <select 
                className="form-input" 
                style={{ paddingLeft: '40px' }} 
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                disabled={taluksList.length === 0}
              >
                {taluksList.map(taluk => (
                  <option key={taluk} value={taluk}>{taluk}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Disaster Type</label>
            <select className="form-input" value={disasterTypeInput} onChange={(e) => setDisasterTypeInput(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Flood">Flood</option>
              <option value="Heavy Rainfall">Heavy Rainfall</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Heatwave">Heatwave</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Time Period</label>
            <select className="form-input" value={timePeriodInput} onChange={(e) => setTimePeriodInput(e.target.value)}>
              <option value="All history">All history (Since 2000)</option>
              <option value="Last 10 years">Last 10 years</option>
              <option value="Last 5 years">Last 5 years</option>
              <option value="Last year">Last year</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleViewHistory}>
          <Search size={18} style={{ marginRight: '8px' }} />
          View History
        </button>
      </div>

      {searched && (
        <>
          <div style={{ textAlign: 'center', margin: '32px 0 16px' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {displayData.taluk}, {displayData.district}, {displayData.state}
            </h3>
            <div style={{ color: 'var(--status-flooded)', fontWeight: 600, textTransform: 'uppercase' }}>
              {displayData.type} HISTORY
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {displayData.history.length > 0 ? (
              displayData.history.map(item => (
                <div key={item.id} className="card" style={{ borderLeft: '4px solid var(--status-caution)' }}>
                  <div className="flex justify-between mb-2">
                    <div style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{item.date}</div>
                    <div className="badge badge-caution">{item.type}</div>
                  </div>
                  
                  <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TIME</div>
                      <div style={{ fontWeight: 500 }}>{item.time}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DURATION</div>
                      <div style={{ fontWeight: 500 }}>{item.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RAINFALL</div>
                      <div style={{ fontWeight: 500, color: 'var(--brand-primary)' }}>{item.rainfall}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SOURCE</div>
                      <div style={{ fontWeight: 500 }}>{item.source}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>IMPACT</div>
                    <div>{item.impact}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center p-8" style={{ color: 'var(--text-secondary)' }}>
                No significant {displayData.type.toLowerCase()} events recorded in {displayData.district} for the selected time period.
              </div>
            )}
          </div>

          {displayData.history.length > 0 && (
            <>
              <h3 className="mb-4">Historical Disaster Map</h3>
              <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb', flexDirection: 'column', gap: '8px' }}>
                <MapIcon size={48} color="var(--text-secondary)" />
                <div style={{ color: 'var(--text-secondary)' }}>Historical Map View for {displayData.district} (Placeholder)</div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DisasterHistory;
