# EPA AQI Dashboard

Interactive dashboard for US air quality trends (2023–2025), built on EPA AQS monitoring data. Tracks PM2.5 AQI, Ozone AQI, and unhealthy-day counts with year-over-year comparisons across all 50 states, DC, and US territories.

--> Access the [EDA AQI Dashboard](https://kimthuynh.github.io/air_quality_analysis/overview)

## Features

- **Overview** — national scorecards, monthly PM2.5/Ozone trendline, interactive US choropleth map, and monthly AQI heatmap
- **State Level** — per-state drill-down with year-range selector; scorecards, trendlines, PM2.5 and unhealthy-day heatmaps
- **About** — metric definitions, AQI color legend, data citation

## Getting started

**Local** (requires Node.js 20+):

```bash
cd client
npm install
npm run dev
# Open http://localhost:5173
```

**Docker:**

```bash
docker build -t aqi-dashboard ./client
docker run -p 8080:80 aqi-dashboard
# Open http://localhost:8080
```

**Production build:**

```bash
cd client && npm run build   # outputs to client/dist/
```

## Project structure

```
client/
  src/
    pages/
      Overview.tsx                  # National trends, US map, monthly heatmap
      StateLevel.tsx                # Per-state drill-down with date-range form
      About.tsx                     # Metric cards, AQI legend, data citation
    components/
      Layout.tsx                    # Sidebar nav + main outlet
      MetricCard.tsx
      TrendChart.tsx                # Recharts line chart (PM2.5 + Ozone)
      USMap.tsx                     # react-simple-maps choropleth (us-atlas bundled)
      AQIHeatmap.tsx                # 4×3 monthly AQI grid
      UnhealthyHeatmap.tsx          # 4×3 monthly unhealthy-days grid
      AQILegend.tsx
      Logo.tsx
    context/DataContext.tsx         # CSV loader + shared data
    utils/{data,colors}.ts
  public/data/
    Monthly_aqi_by_state.csv        # CSV served as static asset
  Dockerfile                        # nginx container serving the React build
  package.json
  vite.config.ts
  tailwind.config.ts
```

## Tech stack

| Layer | Package |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router v6 |
| Charts | Recharts 2 |
| US Map | react-simple-maps 3 + us-atlas (bundled) |
| Icons | lucide-react |
| CSV parsing | Papa Parse 5 |
| Styling | Tailwind CSS v3 |

> **Bundle note:** the us-atlas topojson (~500 KB) is bundled at build time so the map works fully offline with no CDN dependency.

## Data

`client/public/data/Monthly_aqi_by_state.csv` — 1,786 rows of monthly state-level AQI aggregates.

| Column | Description |
|---|---|
| `Year-month` | ISO year-month string |
| `Year` / `Month` | Numeric year and month |
| `State_name` | Full state/territory name |
| `pm25_avg_aqi` | Monthly average PM2.5 AQI |
| `pm10_avg_aqi` | Monthly average PM10 AQI |
| `ozone_avg_aqi` | Monthly average Ozone AQI |
| `Unhealthy_days` | Days with AQI 101–200 |
| `Very_unhealthy_days` | Days with AQI 201–300 |

**Source:** US Environmental Protection Agency, [Air Quality System Data Mart](https://www.epa.gov/outdoor-air-quality-data). Pollutants: PM2.5 (param 88101), Ozone 8-hr max (param 44201). 2025 data may be preliminary.
