export interface AQIRow {
  'Year-month': string;
  Year: number;
  Month: number;
  State_name: string;
  pm25_avg_aqi: number;
  pm10_avg_aqi: number;
  ozone_avg_aqi: number;
  Unhealthy_days: number;
  Very_unhealthy_days: number;
}
