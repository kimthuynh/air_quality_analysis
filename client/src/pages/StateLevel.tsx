import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import MetricCard from '../components/MetricCard';
import TrendChart from '../components/TrendChart';
import type { TrendPoint } from '../components/TrendChart';
import AQIHeatmap from '../components/AQIHeatmap';
import UnhealthyHeatmap from '../components/UnhealthyHeatmap';
import { MONTH_NAMES, THEME } from '../theme';

function avg(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : NaN;
}

const DEFAULT_STATE = 'California';

export default function StateLevel() {
  const { data, loading, years, states } = useData();

  // Form values (not yet applied)
  const [selState, setSelState] = useState(DEFAULT_STATE);
  const [yearFrom, setYearFrom] = useState<number | null>(null);
  const [yearTo, setYearTo] = useState<number | null>(null);

  // Applied values (after Search)
  const [activeState, setActiveState] = useState(DEFAULT_STATE);
  const [activeFrom, setActiveFrom] = useState<number | null>(null);
  const [activeTo, setActiveTo] = useState<number | null>(null);

  useEffect(() => {
    if (years.length > 0 && yearTo === null) {
      const max = Math.max(...years);
      setYearFrom(max);
      setYearTo(max);
      setActiveFrom(max);
      setActiveTo(max);
    }
    if (states.length > 0 && !states.includes(DEFAULT_STATE)) {
      setSelState(states[0]);
      setActiveState(states[0]);
    }
  }, [years, states, yearTo]);

  const handleSearch = useCallback(() => {
    if (yearFrom === null || yearTo === null) return;
    setActiveState(selState);
    setActiveFrom(Math.min(yearFrom, yearTo));
    setActiveTo(Math.max(yearFrom, yearTo));
  }, [selState, yearFrom, yearTo]);

  const from = activeFrom ?? 2025;
  const to   = activeTo ?? 2025;
  const singleYear = from === to;
  const rangeLabel = singleYear ? String(from) : `${from}–${to}`;

  const stateData = useMemo(() =>
    data.filter(r => r.State_name === activeState && r.Year >= from && r.Year <= to),
    [data, activeState, from, to]
  );
  const mainData = useMemo(() =>
    data.filter(r => r.State_name === activeState && r.Year === to),
    [data, activeState, to]
  );
  const prevYearData = useMemo(() =>
    data.filter(r => r.State_name === activeState && r.Year === to - 1),
    [data, activeState, to]
  );

  const avgPm25  = avg(mainData.map(r => r.pm25_avg_aqi));
  const avgOzone = avg(mainData.map(r => r.ozone_avg_aqi));
  const totalUnhealthy = stateData.reduce((s, r) => s + r.Unhealthy_days, 0);
  const prevPm25  = prevYearData.length ? avg(prevYearData.map(r => r.pm25_avg_aqi))  : null;
  const prevOzone = prevYearData.length ? avg(prevYearData.map(r => r.ozone_avg_aqi)) : null;

  const trendData = useMemo((): TrendPoint[] => {
    if (singleYear) {
      const acc = new Map<number, { pm25: number; oz: number; n: number }>();
      stateData.forEach(r => {
        const m = acc.get(r.Month) ?? { pm25: 0, oz: 0, n: 0 };
        acc.set(r.Month, { pm25: m.pm25 + r.pm25_avg_aqi, oz: m.oz + r.ozone_avg_aqi, n: m.n + 1 });
      });
      return Array.from({ length: 12 }, (_, i) => {
        const m = acc.get(i + 1);
        return { label: MONTH_NAMES[i], pm25: m ? m.pm25 / m.n : 0, ozone: m ? m.oz / m.n : 0 };
      }).filter(d => d.pm25 > 0 || d.ozone > 0);
    }
    return [...stateData]
      .sort((a, b) => a.Year - b.Year || a.Month - b.Month)
      .map(r => ({ label: r['Year-month'], pm25: r.pm25_avg_aqi, ozone: r.ozone_avg_aqi }));
  }, [stateData, singleYear]);

  const heatSource = useMemo(() =>
    data.filter(r => r.State_name === activeState && r.Year === to),
    [data, activeState, to]
  );

  const pm25Heat = useMemo(() => {
    const acc = new Map<number, { total: number; n: number }>();
    heatSource.forEach(r => {
      const m = acc.get(r.Month) ?? { total: 0, n: 0 };
      acc.set(r.Month, { total: m.total + r.pm25_avg_aqi, n: m.n + 1 });
    });
    return Array.from({ length: 12 }, (_, i) => {
      const m = acc.get(i + 1);
      return { month: i + 1, value: m ? m.total / m.n : 0 };
    });
  }, [heatSource]);

  const unhealthyHeat = useMemo(() => {
    const acc = new Map<number, number>();
    heatSource.forEach(r => acc.set(r.Month, (acc.get(r.Month) ?? 0) + r.Unhealthy_days));
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: acc.get(i + 1) ?? 0 }));
  }, [heatSource]);

  const sortedYears = [...years].sort((a, b) => a - b);
  const sel = (label: string, val: number | null, onChange: (n: number) => void) => (
    <div>
      <div className="text-xs mb-1.5 uppercase tracking-wide" style={{ color: THEME.textSecondary }}>{label}</div>
      <select
        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
        style={{ background: '#1a2030', color: THEME.textPrimary, borderColor: THEME.border }}
        value={val ?? ''}
        onChange={e => onChange(Number(e.target.value))}
      >
        {sortedYears.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );

  if (loading || activeFrom === null) {
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
        className="sticky top-0 z-10 px-6 py-3 border-b flex flex-wrap items-end gap-3"
        style={{ background: '#0A0E14', borderColor: THEME.border }}
      >
        <div>
          <div className="text-xs mb-1.5 uppercase tracking-wide" style={{ color: THEME.textSecondary }}>State</div>
          <select
            className="rounded-lg px-3 py-2 text-sm outline-none border"
            style={{ background: '#1a2030', color: THEME.textPrimary, borderColor: THEME.border, minWidth: 160 }}
            value={selState}
            onChange={e => setSelState(e.target.value)}
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {sel('From', yearFrom, setYearFrom)}
        {sel('To', yearTo, setYearTo)}
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          style={{ background: THEME.primary, color: '#040101' }}
          onMouseEnter={e => (e.currentTarget.style.background = THEME.primaryHover)}
          onMouseLeave={e => (e.currentTarget.style.background = THEME.primary)}
          onClick={handleSearch}
        >
          <Search size={16} strokeWidth={2.5} />
          Search
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: THEME.textPrimary }}>
            <MapPin size={26} style={{ color: THEME.primary }} />
            {activeState}
          </h1>
          <p className="mt-1 text-sm" style={{ color: THEME.textSecondary }}>
            Showing <strong style={{ color: THEME.textPrimary }}>{rangeLabel}</strong>.
            {' '}Scorecards compare <strong style={{ color: THEME.textPrimary }}>{to}</strong> vs{' '}
            <strong style={{ color: THEME.textPrimary }}>{to - 1}</strong>.
          </p>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Avg PM2.5 AQI"
            value={isNaN(avgPm25) ? 'N/A' : avgPm25.toFixed(1)}
            delta={prevPm25 !== null && !isNaN(avgPm25) ? avgPm25 - prevPm25 : null}
          />
          <MetricCard
            label="Avg Ozone AQI"
            value={isNaN(avgOzone) ? 'N/A' : avgOzone.toFixed(1)}
            delta={prevOzone !== null && !isNaN(avgOzone) ? avgOzone - prevOzone : null}
          />
          <MetricCard
            label="Total Unhealthy Days"
            value={String(totalUnhealthy)}
            sub={`in ${rangeLabel}`}
          />
        </div>

        {/* Trend chart */}
        <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: THEME.textPrimary }}>
            Monthly Trends — {activeState} ({rangeLabel})
          </h3>
          <TrendChart data={trendData} />
        </div>

        {/* Heatmaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
            <AQIHeatmap data={pm25Heat} title={`PM2.5 AQI — ${to}`} />
          </div>
          <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
            <UnhealthyHeatmap data={unhealthyHeat} title={`Unhealthy Days — ${to}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
