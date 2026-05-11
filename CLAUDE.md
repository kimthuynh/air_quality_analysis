# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive dashboard for US air quality trends (2023–2025) by state and county, built on EPA AQS daily monitoring data. Covers AQI, PM2.5, and Ozone with year-over-year comparisons and geographic breakdowns.

The project is Python-based. The `.gitignore` includes patterns for both **Streamlit** and **Marimo** — either may be used as the dashboard framework.

## Data

`app/data/Monthly_aqi_by_state.csv` — 1,786 rows of monthly state-level AQI data.

Columns: `Year-month`, `Year`, `Month`, `State_name`, `pm25_avg_aqi`, `pm10_avg_aqi`, `ozone_avg_aqi`, `Unhealthy_days`, `Very_unhealthy_days`

## Running the dashboard

```bash
# Local (requires Python 3.11+ with pip)
pip install -r requirements.txt
streamlit run app.py

# Docker
docker build -f Dockerfile.app -t aqi-dashboard .
docker run -p 8501:8501 aqi-dashboard
# Open http://localhost:8501
```

## Project structure

```
app.py                        # Entry point — st.navigation wires the 3 pages
pages/
  overview.py                 # Page 1: national trends, US map, monthly heatmap
  state_level.py              # Page 2: per-state drill-down with search form
  about.py                    # Page 3: how-to, metric cards, AQI legend, citation
utils.py                      # Shared: data loader, AQI color helpers, HTML renderers
app/data/Monthly_aqi_by_state.csv
```

## Docker

`Dockerfile` — Node.js 20 environment for running Claude Code CLI (dev only).
`Dockerfile.app` — Python 3.11 container for running the Streamlit app.
