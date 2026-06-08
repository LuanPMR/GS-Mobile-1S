export type Satellite = {
  id: number;
  name: string;
  region: string;
  active?: boolean;
  lastSeen?: string;
};

export type AlertItem = {
  id: string;
  title: string;
  region: string;
  severity: 'low' | 'medium' | 'high';
  timestamp?: string;
};
export interface SatelliteReading {
  id: string;
  timestamp: string; // ISO
  lat: number;
  lon: number;
  ndvi?: number; // vegetation index (optional)
  alert?: 'ok' | 'warning' | 'danger';
}
