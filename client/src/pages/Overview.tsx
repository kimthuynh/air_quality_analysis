import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Wind } from 'lucide-react';
import { useData } from '../context/DataContext';
import MetricCard from '../components/MetricCard';
import TrendChart from '../components/TrendChart';
import type { TrendPoint } from '../components/TrendChart';
import USMap from '../components/USMap';
import AQIHeatmap from '../components/AQIHeatmap';
import { unhealthyDaysColor } from '../utils/colors';
import { MONTH_NAMES, THEME } from '../theme';

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: THEME.textPrimary }}>{title}</h3>
      {children}
    </div>
  );
}

function avg(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

export default function Overview() {
  const { data, loading, years } = useData();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(Math.max(...years));
    }
  }, [years, selectedYear]);

  const year = selectedYear ?? 0;
  const yearData = useMemo(() => data.filter(r => r.Year === year), [data, year]);
  const prevData = useMemo(() => data.filter(r => r.Year === year - 1), [data, year]);

  const avgPm25  = avg(yearData.map(r => r.pm25_avg_aqi));
  const avgOzone = avg(yearData.map(r => r.ozone_avg_aqi));
  const prevPm25  = prevData.length ? avg(prevData.map(r => r.pm25_avg_aqi))  : null;
  const prevOzone = prevData.length ? avg(prevData.map(r => r.ozone_avg_aqi)) : null;

  const stateUnhealthy = useMemo(() => {
    const m = new Map<string, number>();
    yearData.forEach(r => m.set(r.State_name, (m.get(r.State_name) ?? 0) + r.Unhealthy_days));
    return m;
  }, [yearData]);

  const stateVeryUnhealthy = useMemo(() => {
    const m = new Map<string, number>();
    yearData.forEach(r => m.set(r.State_name, (m.get(r.State_name) ?? 0) + r.Very_unhealthy_days));
    return m;
  }, [yearData]);

  const topUnhealthy     = [...stateUnhealthy.entries()].sort((a, b) => b[1] - a[1])[0];
  const topVeryUnhealthy = [...stateVeryUnhealthy.entries()].sort((a, b) => b[1] - a[1])[0];

  const trendData = useMemo((): TrendPoint[] => {
    const acc = new Map<number, { pm25: number; oz: number; n: number }>();
    yearData.forEach(r => {
      const m = acc.get(r.Month) ?? { pm25: 0, oz: 0, n: 0 };
      acc.set(r.Month, { pm25: m.pm25 + r.pm25_avg_aqi, oz: m.oz + r.ozone_avg_aqi, n: m.n + 1 });
    });
    return Array.from({ length: 12 }, (_, i) => {
      const m = acc.get(i + 1);
      return { label: MONTH_NAMES[i], pm25: m ? m.pm25 / m.n : 0, ozone: m ? m.oz / m.n : 0 };
    }).filter(d => d.pm25 > 0 || d.ozone > 0);
  }, [yearData]);

  const stateMapData = stateUnhealthy;

  const heatmapData = useMemo(() => {
    const acc = new Map<number, { total: number; n: number }>();
    yearData.forEach(r => {
      const m = acc.get(r.Month) ?? { total: 0, n: 0 };
      acc.set(r.Month, { total: m.total + r.pm25_avg_aqi, n: m.n + 1 });
    });
    return Array.from({ length: 12 }, (_, i) => {
      const m = acc.get(i + 1);
      return { month: i + 1, value: m ? m.total / m.n : 0 };
    });
  }, [yearData]);

  if (loading || selectedYear === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div style={{ color: THEME.textSecondary }}>Loading data…</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div
        className="sticky top-0 z-10 px-6 py-3 border-b flex items-center gap-3"
        style={{ background: '#0A0E14', borderColor: THEME.border }}
      >
        <span className="text-sm" style={{ color: THEME.textSecondary }}>Year</span>
        <select
          className="rounded-lg px-3 py-1.5 text-sm outline-none border"
          style={{ background: '#1a2030', color: THEME.textPrimary, borderColor: THEME.border }}
          value={selectedYear ?? ''}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {[...years].sort((a, b) => b - a).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="p-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: THEME.textPrimary }}>
            <Wind size={26} style={{ color: THEME.primary }} />
            US Air Quality Dashboard
          </h1>
          <p className="mt-1 text-sm max-w-2xl" style={{ color: THEME.textSecondary }}>
            EPA monitoring data (2023–2025) across all US states — national trends,
            worst-performing regions, and year-over-year changes.
          </p>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Avg PM2.5 AQI"
            value={avgPm25.toFixed(1)}
            delta={prevPm25 !== null ? avgPm25 - prevPm25 : null}
          />
          <MetricCard
            label="Avg Ozone AQI"
            value={avgOzone.toFixed(1)}
            delta={prevOzone !== null ? avgOzone - prevOzone : null}
          />
          <MetricCard
            label="Most Unhealthy Days"
            value={topUnhealthy?.[0] ?? 'N/A'}
            sub={topUnhealthy ? `${topUnhealthy[1]} days` : undefined}
          />
          <MetricCard
            label="Most Very Unhealthy Days"
            value={topVeryUnhealthy?.[0] ?? 'N/A'}
            sub={topVeryUnhealthy ? `${topVeryUnhealthy[1]} days` : undefined}
          />
        </div>

        {/* Trend chart */}
        <Card title={`Monthly Trends — ${year}`}>
          <TrendChart data={trendData} />
        </Card>

        {/* Map + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <Card title={`Unhealthy Days by State — ${year}`}>
              <USMap
                stateData={stateMapData}
                colorFn={unhealthyDaysColor}
                valueLabel="Unhealthy Days"
                formatValue={v => String(v)}
              />
            </Card>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
              <AQIHeatmap
                data={heatmapData}
                title={`National Avg PM2.5 AQI — ${year}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
