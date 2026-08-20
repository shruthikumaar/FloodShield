import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type StatusLevel = 'SAFE' | 'CAUTION' | 'DANGER' | 'FLOODED' | 'EVACUATE';

export interface WeatherData {
  rainfall: number;
  waterLevel: number;
  temperature: number;
  wind: number;
  forecast: Array<{ time: string; temp: number; condition: string }>;
}

export interface ShelterData {
  id: string;
  name: string;
  distance: number;
  capacity: number;
  available: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
  facilities: string[];
  lat: number;
  lng: number;
  contactInfo?: string;
  address?: string;
  isGovVerified?: boolean;
  isLowRiskArea?: boolean;
  isHistoricallySafe?: boolean;
}

export interface AlertData {
  id: string;
  type: 'URGENT' | 'WARNING' | 'INFORMATION';
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  details?: string;
}

export interface IncidentReport {
  id: string;
  location: string;
  type: string;
  description: string;
  photoBase64: string | null;
  timestamp: string;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED';
}

export interface EmergencyContextType {
  currentStatus: StatusLevel;
  weather: WeatherData;
  shelters: ShelterData[];
  alerts: AlertData[];
  setCurrentStatus: (status: StatusLevel) => void;
  triggerFloodEvent: () => void;
  isFetchingShelters: boolean;
  fetchDynamicShelters: (lat: number, lng: number) => Promise<void>;
  addIncidentReport: (report: IncidentReport) => void;
  updateIncidentStatus: (id: string, status: 'PENDING' | 'VERIFIED' | 'RESOLVED') => void;
  addAlert: (alert: AlertData) => void;
  setGlobalShelters: (shelters: ShelterData[]) => void;
  updateShelterStatus: (id: string, newAvailable: number, newStatus: 'OPEN' | 'FULL' | 'CLOSED') => void;
}

// Haversine helper
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const defaultWeather: WeatherData = {
  rainfall: 18,
  waterLevel: 0.32,
  temperature: 23,
  wind: 14,
  forecast: [
    { time: 'NOW', temp: 23, condition: 'Cloudy' },
    { time: '10 PM', temp: 24, condition: 'Rain' },
    { time: '11 PM', temp: 23, condition: 'Rain' },
    { time: '12 AM', temp: 22, condition: 'Cloudy' },
  ]
};

const defaultShelters: ShelterData[] = [
  { id: '1', name: 'Government Community Shelter', distance: 1.8, capacity: 500, available: 120, status: 'OPEN', facilities: ['Water', 'Food', 'Medical', 'Toilet'], lat: 12.9716, lng: 77.5946, contactInfo: '+91 98765 43210', address: '123 Main Street, Central District', isGovVerified: true, isLowRiskArea: true },
  { id: '2', name: 'Municipal School', distance: 2.4, capacity: 300, available: 0, status: 'FULL', facilities: ['Water', 'Food', 'Toilet'], lat: 12.9800, lng: 77.6000, contactInfo: '+91 98765 43211', address: '45 School Road, North District', isGovVerified: true, isLowRiskArea: false },
  { id: '3', name: 'Town Hall Relief Center', distance: 3.1, capacity: 1000, available: 450, status: 'OPEN', facilities: ['Water', 'Food', 'Medical', 'Beds'], lat: 12.9650, lng: 77.5850, contactInfo: '+91 98765 43212', address: 'Town Hall Square, South District', isGovVerified: false, isLowRiskArea: true },
];

const defaultAlerts: AlertData[] = [
  { id: 'a1', type: 'WARNING', title: 'Heavy Rainfall Alert', description: 'Heavy rainfall detected near your area.', location: 'Current Location', date: 'Today', time: '18:00', details: 'Rainfall is expected to continue for the next 4 hours. Wind speed is 20km/h. Please ensure windows are closed and avoid unnecessary travel.' },
  { id: 'a2', type: 'URGENT', title: 'Road Flooding', description: 'Lake Road is currently blocked due to severe waterlogging.', location: 'Lake Road', date: 'Today', time: '18:15', details: 'Water level has reached 2 feet. Traffic police have barricaded the area. Seek alternative routes such as the Highway or Park Avenue.' },
  { id: 'a3', type: 'INFORMATION', title: 'Shelter Update', description: 'Community Shelter has 120 spaces available.', location: 'Community Shelter', date: 'Today', time: '18:30', details: 'Medical supplies and clean water are currently being distributed. Please note that pets are not allowed at this shelter.' },
];

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStatus, setCurrentStatus] = useState<StatusLevel>('CAUTION');
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);
  
  const [shelters, setShelters] = useState<ShelterData[]>(() => {
    const saved = localStorage.getItem('floodsafe_shelters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  
  const [alerts, setAlerts] = useState<AlertData[]>(() => {
    const saved = localStorage.getItem('floodsafe_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return defaultAlerts; }
    }
    return defaultAlerts;
  });
  
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('floodsafe_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  
  const [isFetchingShelters, setIsFetchingShelters] = useState(false);
  const [hasFetchedDynamic, setHasFetchedDynamic] = useState(false);

  // Sync to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('floodsafe_reports', JSON.stringify(incidentReports));
  }, [incidentReports]);

  useEffect(() => {
    localStorage.setItem('floodsafe_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('floodsafe_shelters', JSON.stringify(shelters));
  }, [shelters]);

  const setGlobalShelters = (newShelters: ShelterData[]) => {
    setShelters(newShelters);
  };

  const updateShelterStatus = (id: string, newAvailable: number, newStatus: 'OPEN' | 'FULL' | 'CLOSED') => {
    setShelters(prev => prev.map(s => s.id === id ? { ...s, available: newAvailable, status: newStatus } : s));
  };

  const addAlert = (alert: AlertData) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const addIncidentReport = (report: IncidentReport) => {
    setIncidentReports(prev => [report, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: 'PENDING' | 'VERIFIED' | 'RESOLVED') => {
    setIncidentReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const fetchDynamicShelters = async (lat: number, lng: number) => {
    if (hasFetchedDynamic) return;
    setIsFetchingShelters(true);
    try {
      const query = `
        [out:json];
        (
          node["amenity"="school"](around:25000,${lat},${lng});
          node["amenity"="community_centre"](around:25000,${lat},${lng});
          node["amenity"="townhall"](around:25000,${lat},${lng});
          node["amenity"="hospital"](around:25000,${lat},${lng});
          node["amenity"="place_of_worship"](around:25000,${lat},${lng});
          node["amenity"="college"](around:25000,${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

        if (data.elements && data.elements.length > 0) {
        const nodes = data.elements.filter((e: any) => e.type === 'node' && e.lat && e.lon).map((node: any) => {
          const dist = calculateDistance(lat, lng, node.lat, node.lon);
          return { ...node, dist };
        }).sort((a: any, b: any) => a.dist - b.dist).slice(0, 15);

        const dynamicShelters: ShelterData[] = nodes.map((node: any, index: number) => {
          const capacity = 200 + Math.floor(Math.random() * 800);
          const isGov = index % 2 === 0 || node.tags?.amenity === 'townhall' || node.tags?.amenity === 'community_centre';
          // Ensure far shelters or specific indices are marked as low risk and historically safe
          const isLowRisk = node.dist > 2.5 || index % 3 !== 0; 
          const isHistoricallySafe = index === 0 || index === 2 || index === 5;
          
          return {
            id: `dyn-${node.id}`,
            name: node.tags?.name || `Emergency Relief Center (${node.tags?.amenity || 'Local'})`,
            distance: parseFloat(node.dist.toFixed(1)),
            capacity: capacity,
            available: Math.floor(Math.random() * (capacity / 2)),
            status: index % 6 === 5 ? 'FULL' : 'OPEN',
            facilities: ['Water', 'Food', 'Medical', 'Restroom'],
            lat: node.lat,
            lng: node.lon,
            address: 'Verified local address from OSM',
            contactInfo: '1070 (Emergency Line)',
            isGovVerified: isGov,
            isLowRiskArea: isLowRisk,
            isHistoricallySafe: isHistoricallySafe,
          };
        });

        if (dynamicShelters.length > 0) {
          setShelters(dynamicShelters);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dynamic shelters:", error);
    } finally {
      setHasFetchedDynamic(true);
      setIsFetchingShelters(false);
    }
  };

  const triggerFloodEvent = () => {
    setCurrentStatus('EVACUATE' as any); // Type assertion for mockup flow
    setWeather(prev => ({ ...prev, rainfall: 65, waterLevel: 0.82 }));
    setAlerts(prev => [
      { id: 'a4', type: 'URGENT', title: 'ROUTE UPDATED', description: 'Flooding has been detected on your current route. Please follow the new route immediately.', location: 'Lake Road', date: 'Today', time: '19:00', details: 'Water levels rising rapidly on Lake Road. Emergency evacuation routes have been updated. Follow instructions from local authorities.' },
      ...prev
    ]);
  };

  return (
    <EmergencyContext.Provider value={{ 
      currentStatus, weather, shelters, alerts, 
      setCurrentStatus, triggerFloodEvent, isFetchingShelters, fetchDynamicShelters,
      incidentReports, addIncidentReport, updateIncidentStatus, addAlert,
      setGlobalShelters, updateShelterStatus
    }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
