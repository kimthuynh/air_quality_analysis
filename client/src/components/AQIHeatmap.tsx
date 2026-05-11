import { MONTH_NAMES } from '../theme';
import { aqiColor, aqiTextColor } from '../utils/colors';

interface HeatmapProps {
  data: { month: number; value: number }[];
  title: string;
}

export default function AQIHeatmap({ data, title }: HeatmapProps) {
  const byMonth = new Map(data.map(d => [d.month, d.value]));

  return (
    <div>
      <div className="text-sm font-semibold mb-3" style={{ color: '#F0F4F8' }}>{title}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {MONTH_NAMES.map((name, i) => {
          const value = byMonth.get(i + 1) ?? 0;
          const bg = value > 0 ? aqiColor(value) : '#1f2937';
          const fg = aqiTextColor(bg);
          return (
            <div
              key={i}
              className="rounded-md p-2 text-center select-none"
              style={{ background: bg, minHeight: 54 }}
              title={`${name}: ${value > 0 ? value.toFixed(1) : 'No data'}`}
            >
              <div className="text-xs font-semibold" style={{ color: fg, opacity: 0.75 }}>{name}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: fg }}>
                {value > 0 ? value.toFixed(0) : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
