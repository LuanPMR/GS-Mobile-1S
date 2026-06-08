export interface SatelliteReading {
  id: string;
  timestamp: string; // ISO
  lat: number;
  lon: number;
  ndvi?: number; // vegetation index (optional)
  alert?: 'ok' | 'warning' | 'danger';
}
