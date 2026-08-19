export type SafetyStatus = 'SAFE' | 'WARNING' | 'DANGER';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface WeatherData {
  temperature: number;
  rainfall: number; // mm/hr
  rainProbability: number;
  windSpeed: number;
  humidity: number;
  condition: string;
}

export interface FloodSensorData {
  sensorId: string;
  latitude: number;
  longitude: number;
  waterLevel: number; // meters
  rainfall: number;
  timestamp: number;
  status: string;
}

export interface FloodRiskCell {
  h3Index: string;
  riskScore: number; // 0 - 100
  status: SafetyStatus;
  rainfall: number;
  waterLevel: number;
  elevation: number;
  lastUpdated: number;
  latitude?: number;
  longitude?: number;
}

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number; // km
  estimatedTime: number; // minutes
  capacity: number;
  maxCapacity: number;
  areaRisk: SafetyStatus;
  accessibilityStatus: 'OPEN' | 'LIMITED' | 'CLOSED';
}

export interface EvacuationRoute {
  id: string;
  distance: number; // km
  estimatedTime: number; // minutes
  floodRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  destinationId: string;
  path: [number, number][]; // Array of [lat, lng]
}

export interface EmergencyAlert {
  id: string;
  type: 'HIGH_FLOOD_ALERT' | 'ROAD_CLOSED' | 'SHELTER_UPDATE' | 'GENERAL';
  title: string;
  message: string;
  timestamp: number;
}
