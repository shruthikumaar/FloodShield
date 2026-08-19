import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

export interface AlertData {
  id: string;
  type: 'URGENT' | 'WARNING' | 'INFORMATION';
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
}

export interface EmergencyContextType {
  currentStatus: StatusLevel;
  weather: WeatherData;
  shelters: ShelterData[];
  alerts: AlertData[];
  setCurrentStatus: (status: StatusLevel) => void;
  triggerFloodEvent: () => void;
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
  { id: '1', name: 'Government Community Shelter', distance: 1.8, capacity: 500, available: 120, status: 'OPEN', facilities: ['Water', 'Food', 'Medical', 'Toilet'], lat: 12.9716, lng: 77.5946 },
  { id: '2', name: 'Municipal School', distance: 2.4, capacity: 300, available: 0, status: 'FULL', facilities: ['Water', 'Food', 'Toilet'], lat: 12.9800, lng: 77.6000 },
  { id: '3', name: 'Town Hall Relief Center', distance: 3.1, capacity: 1000, available: 450, status: 'OPEN', facilities: ['Water', 'Food', 'Medical', 'Beds'], lat: 12.9650, lng: 77.5850 },
];

const defaultAlerts: AlertData[] = [
  { id: 'a1', type: 'WARNING', title: 'Heavy Rainfall Alert', description: 'Heavy rainfall detected near your area.', location: 'Current Location', date: 'Today', time: '18:00' },
  { id: 'a2', type: 'URGENT', title: 'Road Flooding', description: 'Lake Road is currently blocked due to severe waterlogging.', location: 'Lake Road', date: 'Today', time: '18:15' },
  { id: 'a3', type: 'INFORMATION', title: 'Shelter Update', description: 'Community Shelter has 120 spaces available.', location: 'Community Shelter', date: 'Today', time: '18:30' },
];

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStatus, setCurrentStatus] = useState<StatusLevel>('CAUTION');
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);
  const [shelters, setShelters] = useState<ShelterData[]>(defaultShelters);
  const [alerts, setAlerts] = useState<AlertData[]>(defaultAlerts);

  const triggerFloodEvent = () => {
    setCurrentStatus('EVACUATE' as any); // Type assertion for mockup flow
    setWeather(prev => ({ ...prev, rainfall: 65, waterLevel: 0.82 }));
    setAlerts(prev => [
      { id: 'a4', type: 'URGENT', title: 'ROUTE UPDATED', description: 'Flooding has been detected on your current route. Please follow the new route immediately.', location: 'Lake Road', date: 'Today', time: '19:00' },
      ...prev
    ]);
  };

  return (
    <EmergencyContext.Provider value={{ currentStatus, weather, shelters, alerts, setCurrentStatus, triggerFloodEvent }}>
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
