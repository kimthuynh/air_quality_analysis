import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
from utils import (
    apply_theme, render_footer, aqi_legend_html,
    BG, CARD, PRIMARY, TEXT, TEXT2, BORDER,
)

apply_theme()

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown(f'<h1 style="color:{TEXT};margin-bottom:4px;">ℹ️ About This Dashboard</h1>',
            unsafe_allow_html=True)
st.markdown(
    f'<p style="color:{TEXT2};font-size:15px;max-width:820px;line-height:1.7;">'
    "This dashboard visualizes daily air quality data from EPA's Air Quality System (AQS) "
    "across thousands of monitoring stations nationwide, covering 2023–2025 for all 50 states, "
    "DC, and US territories. Data is aggregated to monthly state-level averages for PM2.5 AQI, "
    "Ozone AQI, and counts of unhealthy air quality days."
    "</p>",
    unsafe_allow_html=True,
)

st.markdown("<div style='margin-top:28px;'></div>", unsafe_allow_html=True)

# ── How to use ────────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:14px;">How to Use</h3>', unsafe_allow_html=True)

how_to = [
    ("📊 Overview",
     "Select a year from the sidebar to see national trends, the interactive US map, "
     "and the states with the worst air quality."),
    ("🗺️ State Page",
     "Choose a state and date range, then click <b>Search</b> to update the charts. "
     "Compare monthly PM2.5 and Ozone trends alongside unhealthy-day counts."),
    ("🟥 Heatmap",
     "The 3×4 grid shows all 12 months at a glance. For AQI heatmaps, colors follow "
     "the EPA AQI scale — darker red means worse air. For unhealthy-day heatmaps, "
     "deeper red means more bad-air days that month."),
]

cols = st.columns(3, gap="medium")
for col, (title, body) in zip(cols, how_to):
    with col:
        st.markdown(
            f'<div style="background:{CARD};border-radius:10px;padding:18px 16px;'
            f'border:1px solid {BORDER};height:100%;">'
            f'<div style="color:{PRIMARY};font-size:15px;font-weight:700;margin-bottom:8px;">{title}</div>'
            f'<div style="color:{TEXT2};font-size:13px;line-height:1.6;">{body}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )

st.markdown("<div style='margin-top:32px;'></div>", unsafe_allow_html=True)

# ── Metric cards ──────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:14px;">Key Metrics</h3>', unsafe_allow_html=True)

metrics = [
    ("PM2.5 AQI", "🔬",
     "Fine particulate matter (≤2.5 µm) penetrates deep into the lungs and bloodstream. "
     "Even short-term exposure above 35 µg/m³ (AQI ~100) can aggravate asthma, heart disease, "
     "and other conditions. This dashboard uses the EPA AQI scale so values are comparable "
     "across pollutants."),
    ("Ozone AQI", "☀️",
     "Ground-level ozone forms when sunlight reacts with pollutants from vehicles and industry. "
     "It peaks on hot, sunny afternoons and can cause chest pain, coughing, and reduced lung "
     "function. The 8-hour average ozone standard is the basis for the AQI calculation shown here."),
    ("Unhealthy Days", "📅",
     "The number of days per month when the Air Quality Index was <b>Unhealthy for Sensitive Groups "
     "(AQI 101–150)</b> or <b>Unhealthy (AQI 151–200)</b>. People with heart or lung disease, "
     "older adults, and children should limit prolonged outdoor exertion on these days."),
]

m1, m2, m3 = st.columns(3, gap="medium")
for col, (title, icon, body) in zip([m1, m2, m3], metrics):
    with col:
        st.markdown(
            f'<div style="background:{CARD};border-radius:10px;padding:18px 16px;'
            f'border:1px solid {BORDER};height:100%;">'
            f'<div style="font-size:26px;margin-bottom:8px;">{icon}</div>'
            f'<div style="color:{TEXT};font-size:14px;font-weight:700;margin-bottom:8px;">{title}</div>'
            f'<div style="color:{TEXT2};font-size:13px;line-height:1.6;">{body}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )

st.markdown("<div style='margin-top:32px;'></div>", unsafe_allow_html=True)

# ── AQI legend ────────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:10px;">AQI Color Legend</h3>',
            unsafe_allow_html=True)
st.markdown(aqi_legend_html(), unsafe_allow_html=True)

st.markdown("<div style='margin-top:32px;'></div>", unsafe_allow_html=True)

# ── Data citation ─────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:10px;">Data Source</h3>', unsafe_allow_html=True)
st.markdown(
    f'<div style="background:{CARD};border-radius:10px;padding:18px 20px;'
    f'border:1px solid {BORDER};max-width:860px;">'
    f'<p style="color:{TEXT2};font-size:13px;line-height:1.7;margin:0;">'
    "US Environmental Protection Agency. <em>Air Quality System Data Mart</em> [internet database] "
    "available via "
    f'<a href="https://www.epa.gov/outdoor-air-quality-data" target="_blank" style="color:{PRIMARY};">'
    "https://www.epa.gov/outdoor-air-quality-data</a>. "
    "Accessed May 09, 2026. Pollutants included: PM2.5 (param 88101), Ozone 8-hr max (param 44201), "
    "Daily AQI by county. "
    "<em>Note: 2025 data may be preliminary. County views include only counties with all 3 pollutants.</em>"
    "</p></div>",
    unsafe_allow_html=True,
)

render_footer()
