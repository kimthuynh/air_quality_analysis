import { THEME } from '../theme';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: number | null;
  sub?: string;
}

export default function MetricCard({ label, value, delta, sub }: MetricCardProps) {
  const hasDelta = delta != null && !isNaN(delta);
  const isWorse = hasDelta && delta! > 0;

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: THEME.card, borderColor: THEME.border }}
    >
      <div
        className="text-xs font-medium mb-1.5 uppercase tracking-wide"
        style={{ color: THEME.textSecondary }}
      >
        {label}
      </div>
      <div className="text-2xl font-bold truncate" style={{ color: THEME.textPrimary }}>
        {value}
      </div>
      {hasDelta && (
        <div
          className="text-xs mt-1.5 font-semibold"
          style={{ color: isWorse ? '#FF7E00' : '#00C48C' }}
        >
          {isWorse ? '▲' : '▼'} {Math.abs(delta!).toFixed(1)} vs prev year
        </div>
      )}
      {sub && (
        <div className="text-xs mt-1" style={{ color: THEME.textSecondary }}>{sub}</div>
      )}
    </div>
  );
}
