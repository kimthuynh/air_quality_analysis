import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { feature } from 'topojson-client';
import usAtlasData from 'us-atlas/states-10m.json';
import { mapColor } from '../utils/colors';
import { THEME } from '../theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statesGeo = feature(usAtlasData as any, (usAtlasData as any).objects.states);

interface GeoEntry {
  rsmKey: string;
  properties: { name: string };
}

interface TooltipState { name: string; value: number; x: number; y: number }

interface USMapProps {
  stateData: Map<string, number>;
  colorFn?: (value: number, max: number) => string;
  valueLabel?: string;
  formatValue?: (value: number) => string;
}

const defaultFormat = (v: number) => (v > 0 ? v.toFixed(1) : 'N/A');

export default function USMap({
  stateData,
  colorFn,
  valueLabel = 'PM2.5 AQI',
  formatValue = defaultFormat,
}: USMapProps) {
  const [tip, setTip] = useState<TooltipState | null>(null);

  const lookup = useMemo(
    () => new Map([...stateData.entries()].map(([k, v]) => [k.toLowerCase(), v])),
    [stateData]
  );

  const maxValue = useMemo(() => {
    let m = 0;
    stateData.forEach(v => { if (v > m) m = v; });
    return m;
  }, [stateData]);

  const fillFor = (val: number) =>
    colorFn ? colorFn(val, maxValue) : mapColor(val);

  return (
    <div className="relative">
      <ComposableMap projection="geoAlbersUsa" style={{ width: '100%', height: 'auto' }}>
        <Geographies geography={statesGeo}>
          {({ geographies }: { geographies: GeoEntry[] }) =>
            geographies.map((geo: GeoEntry) => {
              const name = geo.properties.name;
              const val = lookup.get(name.toLowerCase()) ?? 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillFor(val)}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', opacity: 0.78, cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(e: MouseEvent) =>
                    setTip({ name, value: val, x: e.clientX, y: e.clientY })
                  }
                  onMouseMove={(e: MouseEvent) =>
                    setTip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                  }
                  onMouseLeave={() => setTip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tip && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg px-3 py-2 text-xs border shadow-lg"
          style={{
            left: tip.x + 14,
            top: tip.y - 48,
            background: '#111827',
            borderColor: THEME.border,
            color: THEME.textPrimary,
          }}
        >
          <div className="font-semibold">{tip.name}</div>
          <div style={{ color: THEME.primary }}>
            {valueLabel}: {formatValue(tip.value)}
          </div>
        </div>
      )}
    </div>
  );
}
