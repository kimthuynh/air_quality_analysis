import { MONTH_NAMES } from '../theme';
import { unhealthyColor } from '../utils/colors';

interface Props {
  data: { month: number; value: number }[];
  title: string;
}

export default function UnhealthyHeatmap({ data, title }: Props) {
  const byMonth = new Map(data.map(d => [d.month, d.value]));
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div>
      <div className="text-sm font-semibold mb-3" style={{ color: '#F0F4F8' }}>{title}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {MONTH_NAMES.map((name, i) => {
          const value = byMonth.get(i + 1) ?? 0;
          const bg = unhealthyColor(value, max);
          return (
            <div
              key={i}
              className="rounded-md p-2 text-center select-none"
              style={{ background: bg, minHeight: 54 }}
              title={`${name}: ${value} days`}
            >
              <div className="text-xs font-semibold" style={{ color: '#F0F4F8', opacity: 0.75 }}>{name}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: '#F0F4F8' }}>
                {value > 0 ? value : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
