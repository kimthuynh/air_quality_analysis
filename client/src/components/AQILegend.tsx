import { AQI_BANDS } from '../theme';

export default function AQILegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {AQI_BANDS.map(band => (
        <div key={band.label} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded shrink-0" style={{ background: band.color }} />
          <span className="text-xs" style={{ color: '#A0B0C0' }}>
            {band.label}
            <span className="ml-1 opacity-60">
              ({band.min}–{band.max === Infinity ? '300+' : band.max})
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
