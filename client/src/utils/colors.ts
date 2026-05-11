import { interpolateRgb } from 'd3-interpolate';
import { AQI_BANDS } from '../theme';

export function aqiColor(value: number): string {
  for (const band of AQI_BANDS) {
    if (value <= band.max) return band.color;
  }
  return '#7E0023';
}

export function aqiTextColor(bgColor: string): string {
  const dark = new Set(['#34D399', '#FBBF24', '#FB923C']);
  return dark.has(bgColor) ? '#1A202C' : '#F0F4F8';
}

export function mapColor(value: number): string {
  if (value <= 0) return '#374151';
  if (value <= 50) return '#00E400';
  if (value <= 100) return '#FFFF00';
  if (value <= 150) return '#FF7E00';
  if (value <= 200) return '#FF0000';
  if (value <= 300) return '#8F3F97';
  return '#7E0023';
}

export function unhealthyColor(value: number, max: number): string {
  if (value === 0 || max === 0) return '#374151';
  const t = Math.min(value / max, 1);
  const r = Math.round(45 + t * 210);
  const g = Math.round(55 * (1 - t));
  const b = Math.round(55 * (1 - t));
  return `rgb(${r},${Math.max(0, g)},${Math.max(0, b)})`;
}

const unhealthyRampLow = interpolateRgb('#FBBF24', '#EF4444');
const unhealthyRampHigh = interpolateRgb('#EF4444', '#7F1D1D');

export function unhealthyDaysColor(value: number, max: number): string {
  if (value <= 0 || max <= 0) return '#374151';
  const t = Math.min(value / max, 1);
  return t < 0.5 ? unhealthyRampLow(t * 2) : unhealthyRampHigh((t - 0.5) * 2);
}
