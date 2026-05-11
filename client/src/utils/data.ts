import Papa from 'papaparse';
import type { AQIRow } from '../types';

let cache: AQIRow[] | null = null;

export async function loadData(): Promise<AQIRow[]> {
  if (cache) return cache;
  const res = await fetch('/data/Monthly_aqi_by_state.csv');
  const text = await res.text();
  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  cache = data.map(row => ({
    'Year-month': row['Year-month'] ?? '',
    Year: parseInt(row['Year']) || 0,
    Month: parseInt(row['Month']) || 0,
    State_name: row['State_name'] ?? '',
    pm25_avg_aqi: parseFloat(row['pm25_avg_aqi']) || 0,
    pm10_avg_aqi: parseFloat(row['pm10_avg_aqi']) || 0,
    ozone_avg_aqi: parseFloat(row['ozone_avg_aqi']) || 0,
    Unhealthy_days: parseInt(row['Unhealthy_days']) || 0,
    Very_unhealthy_days: parseInt(row['Very_unhealthy_days']) || 0,
  }));
  return cache;
}
