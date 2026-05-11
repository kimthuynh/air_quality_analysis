import { BarChart3, Map, Grid3x3, Cloud, Sun, Calendar, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { THEME } from '../theme';
import AQILegend from '../components/AQILegend';

interface InfoItem {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const HOW_TO: InfoItem[] = [
  {
    Icon: BarChart3,
    title: 'Overview',
    body: 'Select a year from the filter bar to see national trends, the interactive US map, and the states with the worst air quality.',
  },
  {
    Icon: Map,
    title: 'State Level',
    body: 'Choose a state and date range, then click Search. Compare monthly PM2.5 and Ozone trends alongside unhealthy-day counts.',
  },
  {
    Icon: Grid3x3,
    title: 'Heatmap',
    body: 'The 4×3 grid shows all 12 months at a glance. AQI heatmaps follow the EPA color scale; deeper red means worse air.',
  },
];

const METRICS: InfoItem[] = [
  {
    Icon: Cloud,
    title: 'PM2.5 AQI',
    body: 'Fine particulate matter (≤2.5 µm) penetrates deep into the lungs and bloodstream. Even short-term exposure above AQI ~100 can aggravate asthma, heart disease, and other conditions.',
  },
  {
    Icon: Sun,
    title: 'Ozone AQI',
    body: 'Ground-level ozone forms when sunlight reacts with pollutants from vehicles and industry. It peaks on hot, sunny afternoons and can cause chest pain, coughing, and reduced lung function.',
  },
  {
    Icon: Calendar,
    title: 'Unhealthy Days',
    body: 'Days per month when AQI was Unhealthy for Sensitive Groups (101–150) or Unhealthy (151–200). People with heart or lung disease, older adults, and children should limit prolonged outdoor exertion.',
  },
];

function InfoCard({ Icon, title, body }: InfoItem) {
  return (
    <div className="rounded-xl p-5 border h-full" style={{ background: THEME.card, borderColor: THEME.border }}>
      <Icon size={28} style={{ color: THEME.primary, marginBottom: 12 }} strokeWidth={1.75} />
      <div className="text-sm font-semibold mb-2" style={{ color: THEME.primary }}>{title}</div>
      <div className="text-sm leading-relaxed" style={{ color: THEME.textSecondary }}>{body}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: THEME.textPrimary }}>
          <Info size={26} style={{ color: THEME.primary }} />
          About This Dashboard
        </h1>
        <p className="mt-2 text-sm leading-relaxed max-w-3xl" style={{ color: THEME.textSecondary }}>
          This dashboard visualizes daily air quality data from EPA's Air Quality System (AQS) across
          thousands of monitoring stations nationwide, covering 2023–2025 for all 50 states, DC, and
          US territories. Data is aggregated to monthly state-level averages for PM2.5 AQI, Ozone AQI,
          and counts of unhealthy air quality days.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: THEME.textPrimary }}>How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_TO.map(item => <InfoCard key={item.title} {...item} />)}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: THEME.textPrimary }}>Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {METRICS.map(item => <InfoCard key={item.title} {...item} />)}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: THEME.textPrimary }}>AQI Color Legend</h3>
        <div className="rounded-xl p-5 border" style={{ background: THEME.card, borderColor: THEME.border }}>
          <AQILegend />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: THEME.textPrimary }}>Data Source</h3>
        <div
          className="rounded-xl p-5 border text-sm leading-relaxed"
          style={{ background: THEME.card, borderColor: THEME.border, color: THEME.textSecondary }}
        >
          US Environmental Protection Agency.{' '}
          <em>Air Quality System Data Mart</em> [internet database] available via{' '}
          <a
            href="https://www.epa.gov/outdoor-air-quality-data"
            target="_blank"
            rel="noreferrer"
            style={{ color: THEME.primary }}
          >
            https://www.epa.gov/outdoor-air-quality-data
          </a>
          . Accessed May 09, 2026. Pollutants: PM2.5 (param 88101), Ozone 8-hr max (param 44201).{' '}
          <em>2025 data may be preliminary.</em>
        </div>
      </div>
    </div>
  );
}
