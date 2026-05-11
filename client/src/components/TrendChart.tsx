import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { THEME } from '../theme';

export interface TrendPoint {
  label: string;
  pm25: number;
  ozone: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs border"
      style={{ background: '#111827', borderColor: THEME.border, color: THEME.textPrimary }}
    >
      <div className="font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey as string} style={{ color: p.color }}>
          {p.name}: {(p.value as number)?.toFixed(1)}
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({
  data,
  height = 260,
}: {
  data: TrendPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="label"
          tick={{ fill: THEME.textSecondary, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: THEME.textSecondary, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: THEME.textSecondary, fontSize: 12 }}
          iconType="circle"
          iconSize={8}
        />
        <Line
          type="monotone"
          dataKey="pm25"
          name="PM2.5"
          stroke={THEME.primary}
          strokeWidth={2.5}
          dot={{ fill: THEME.primary, r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="ozone"
          name="Ozone"
          stroke="#F5C842"
          strokeWidth={2.5}
          dot={{ fill: '#F5C842', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
