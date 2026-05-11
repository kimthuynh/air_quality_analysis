export const THEME = {
  bg: '#040101',
  primary: '#3AC8FF',
  card: '#2D3748',
  primaryHover: '#1FA8C9',
  textPrimary: '#F0F4F8',
  textSecondary: '#A0B0C0',
  border: 'rgba(255,255,255,0.10)',
} as const;

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface AQIBand {
  min: number;
  max: number;
  color: string;
  label: string;
}

export const AQI_BANDS: AQIBand[] = [
  { min: 0,   max: 50,       color: '#34D399', label: 'Good' },
  { min: 51,  max: 100,      color: '#FBBF24', label: 'Moderate' },
  { min: 101, max: 150,      color: '#FB923C', label: 'Unhealthy for Sensitive Groups' },
  { min: 151, max: 200,      color: '#EF4444', label: 'Unhealthy' },
  { min: 201, max: 300,      color: '#A855F7', label: 'Very Unhealthy' },
  { min: 301, max: Infinity, color: '#7F1D1D', label: 'Hazardous' },
];
