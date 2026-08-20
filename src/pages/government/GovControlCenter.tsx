import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CloudRain, Shield, Activity, MapPin } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import { indiaLocations } from '../../data/indiaLocations';
import { getTaluksForDistrict } from '../../data/indiaTaluks';

const GovControlCenter: React.FC = () => {
  const { alerts, shelters, triggerFloodEvent, addAlert } = useEmergency();
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const typeRef = React.useRef<HTMLSelectElement>(null);
  const msgRef = React.useRef<HTMLTextAreaElement>(null);

  const activeAlertsCount = alerts.length;
  const openSheltersCount = shelters.filter(s => s.status !== 'CLOSED').length;
  const availableCapacity = shelters.reduce((acc, curr) => acc + curr.available, 0);

  const statesList = Object.keys(indiaLocations).sort();
  const [selectedState, setSelectedState] = useState(statesList[13]); // Default to Karnataka
  const [districtsList, setDistrictsList] = useState<string[]>(indiaLocations[statesList[13]]);
  const [selectedDistrict, setSelectedDistrict] = useState(indiaLocations[statesList[13]][0]);
  const [taluksList, setTaluksList] = useState<string[]>(getTaluksForDistrict(indiaLocations[statesList[13]][0]));
  const [selectedTaluk, setSelectedTaluk] = useState(getTaluksForDistrict(indiaLocations[statesList[13]][0])[0]);

  React.useEffect(() => {
    setDistrictsList(indiaLocations[selectedState] || []);
    setSelectedDistrict(indiaLocations[selectedState]?.[0] || '');
  }, [selectedState]);

  React.useEffect(() => {
    if (selectedDistrict) {
      const taluks = getTaluksForDistrict(selectedDistrict);
      setTaluksList(taluks);
      setSelectedTaluk(taluks[0]);
    }
  }, [selectedDistrict]);

  const handleSendAlert = () => {
    const type = typeRef.current?.value || 'INFORMATION';
    const message = msgRef.current?.value || '';
    
    if (!message) {
      alert("Please enter a message for the alert.");
      return;
    }

    addAlert({
      id: `a-${Date.now()}`,
      type: type as 'URGENT' | 'WARNING' | 'INFORMATION',
      title: `GOVERNMENT ${type} BROADCAST`,
      description: message,
      location: `${selectedTaluk}, ${selectedDistrict}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: `Issued by local authorities for ${selectedState}. Please stay alert and follow instructions.`
    });

    setAlertSent(true);
    if (msgRef.current) msgRef.current.value = '';
    
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', gap: '24px' }}>
      
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <h2 className="mb-4">Emergency Control Center</h2>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ borderTop: '4px solid var(--status-danger)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle color="var(--status-danger)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ACTIVE ALERTS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{activeAlertsCount}</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--status-flooded)' }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin color="var(--status-flooded)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>FLOODED ROADS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>12</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--status-safe)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield color="var(--status-safe)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>OPEN SHELTERS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{openSheltersCount}</div>
          </div>
          
          <div className="card" style={{ borderTop: '4px solid var(--brand-primary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity color="var(--brand-primary)" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ACTIVE SENSORS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>26</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3>CREATE EMERGENCY ALERT</h3>
            <button className="btn btn-outline" onClick={() => setPanelOpen(!panelOpen)}>
              Toggle Quick Panel
            </button>
          </div>
          
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="form-group">
              <label className="form-label">Alert Type</label>
              <select className="form-input" ref={typeRef}>
                <option value="URGENT">URGENT</option>
                <option value="WARNING">WARNING</option>
                <option value="INFORMATION">INFORMATION</option>
              </select>
            </div>
            <div className="form-group relative">
              <label className="form-label">State</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
                <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  {statesList.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group relative">
              <label className="form-label">District</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
                <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districtsList.length === 0}>
                  {districtsList.map(district => <option key={district} value={district}>{district}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group relative">
              <label className="form-label">Taluk</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} />
                <select className="form-input" style={{ paddingLeft: '40px' }} value={selectedTaluk} onChange={(e) => setSelectedTaluk(e.target.value)} disabled={taluksList.length === 0}>
                  {taluksList.map(taluk => <option key={taluk} value={taluk}>{taluk}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={3} ref={msgRef} placeholder="Enter alert description..."></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Target</label>
            <select className="form-input">
              <option>All users</option>
              <option>Specific ward</option>
              <option>Specific area</option>
            </select>
          </div>
          
          <button className="btn btn-primary" onClick={handleSendAlert} disabled={alertSent}>
            {alertSent ? 'ALERT SENT SUCCESSFULLY' : 'SEND ALERT'}
          </button>
        </div>

        <div className="card" style={{ backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger)' }}>
          <h3 style={{ color: 'var(--status-danger)' }}>Prototype Controls</h3>
          <p>Use this to test the dynamic routing response for citizens.</p>
          <button className="btn btn-primary" style={{ backgroundColor: 'var(--status-danger)' }} onClick={triggerFloodEvent}>
            Trigger Flood Event (Simulate Blocked Route)
          </button>
        </div>
      </div>

      {/* Right Side Quick Panel */}
      {panelOpen && (
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Quick Panel</h3>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AVAILABLE CAPACITY</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>{availableCapacity} spaces</div>
            
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>RECENT REPORTS</div>
            <div className="mt-2 flex flex-col gap-2">
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                <span className="badge badge-flooded mb-1">Flooded Road</span><br/>
                Lake Road - reported 5 mins ago
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                <span className="badge badge-caution mb-1">Waterlogging</span><br/>
                Market Road - reported 15 mins ago
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovControlCenter;
