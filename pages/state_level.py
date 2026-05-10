import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from utils import (
    load_data, apply_theme, render_footer, metric_card,
    monthly_aqi_heatmap, monthly_unhealthy_heatmap, chart_layout,
    MONTH_NAMES, PRIMARY, TEXT, TEXT2, CARD, BORDER,
)

apply_theme()

df = load_data()
years  = sorted(df["Year"].unique())
states = sorted(df["State_name"].unique())

DEFAULT_STATE = "California"
DEFAULT_YEAR  = 2025

# ── Sidebar form ──────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown(f'<div style="color:{TEXT};font-size:18px;font-weight:700;margin-bottom:16px;">Filters</div>',
                unsafe_allow_html=True)
    with st.form("state_form"):
        sel_state = st.selectbox(
            "State",
            states,
            index=states.index(DEFAULT_STATE) if DEFAULT_STATE in states else 0,
        )
        col_a, col_b = st.columns(2)
        with col_a:
            yr_from = st.selectbox("From", years, index=years.index(DEFAULT_YEAR) if DEFAULT_YEAR in years else 0)
        with col_b:
            yr_to = st.selectbox("To", years, index=len(years) - 1)
        submitted = st.form_submit_button("🔍 Search", use_container_width=True)

    # Persist selections across reruns
    if submitted or "sl_state" not in st.session_state:
        st.session_state.sl_state  = sel_state
        st.session_state.sl_from   = yr_from
        st.session_state.sl_to     = yr_to

active_state = st.session_state.sl_state
active_from  = st.session_state.sl_from
active_to    = st.session_state.sl_to

if active_from > active_to:
    active_from, active_to = active_to, active_from

# ── Data prep ─────────────────────────────────────────────────────────────────
df_state = df[
    (df["State_name"] == active_state) &
    (df["Year"] >= active_from) &
    (df["Year"] <= active_to)
]

# For scorecards: compare first full year vs previous year (YoY)
df_main = df[(df["State_name"] == active_state) & (df["Year"] == active_to)]
df_prev = df[(df["State_name"] == active_state) & (df["Year"] == active_to - 1)]

avg_pm25  = df_main["pm25_avg_aqi"].mean()  if len(df_main) else float("nan")
avg_ozone = df_main["ozone_avg_aqi"].mean() if len(df_main) else float("nan")
total_unhealthy = int(df_state["Unhealthy_days"].sum())

yoy_pm25  = (avg_pm25  - df_prev["pm25_avg_aqi"].mean())  if len(df_prev) else None
yoy_ozone = (avg_ozone - df_prev["ozone_avg_aqi"].mean()) if len(df_prev) else None

# For charts: if single year, show monthly; if range, show full timeline
single_year = (active_from == active_to)

if single_year:
    monthly = df_state.groupby("Month")[
        ["pm25_avg_aqi","ozone_avg_aqi","Unhealthy_days","Very_unhealthy_days"]
    ].mean().reset_index()
    x_labels = monthly["Month"].map(lambda m: MONTH_NAMES[m - 1])
    x_pm25   = x_labels
    y_pm25   = monthly["pm25_avg_aqi"]
    y_ozone  = monthly["ozone_avg_aqi"]
else:
    timeline = df_state.sort_values(["Year","Month"]).copy()
    timeline["YearMonth"] = timeline["Year-month"]
    x_pm25  = timeline["YearMonth"]
    y_pm25  = timeline["pm25_avg_aqi"]
    y_ozone = timeline["ozone_avg_aqi"]
    # For heatmaps use active_to year
    df_heat = df[(df["State_name"] == active_state) & (df["Year"] == active_to)]
    monthly = df_heat.groupby("Month")[
        ["pm25_avg_aqi","ozone_avg_aqi","Unhealthy_days","Very_unhealthy_days"]
    ].mean().reset_index()

# ── Header ────────────────────────────────────────────────────────────────────
range_label = str(active_from) if single_year else f"{active_from}–{active_to}"
st.markdown(
    f'<h1 style="color:{TEXT};margin-bottom:4px;">🗺️ {active_state}</h1>',
    unsafe_allow_html=True,
)
st.markdown(
    f'<p style="color:{TEXT2};font-size:14px;margin-top:0;">Showing data for '
    f'<b style="color:{TEXT};">{range_label}</b>. '
    f'Scorecards compare <b style="color:{TEXT};">{active_to}</b> vs '
    f'<b style="color:{TEXT};">{active_to - 1}</b>.</p>',
    unsafe_allow_html=True,
)

st.markdown("<div style='margin-top:12px;'></div>", unsafe_allow_html=True)

# ── Scorecards ────────────────────────────────────────────────────────────────
c1, c2, c3 = st.columns(3)
pm25_str  = f"{avg_pm25:.1f}"  if not pd.isna(avg_pm25)  else "N/A"
ozone_str = f"{avg_ozone:.1f}" if not pd.isna(avg_ozone) else "N/A"

with c1:
    st.markdown(metric_card("Avg PM2.5 AQI", pm25_str, delta=yoy_pm25), unsafe_allow_html=True)
with c2:
    st.markdown(metric_card("Avg Ozone AQI", ozone_str, delta=yoy_ozone), unsafe_allow_html=True)
with c3:
    st.markdown(metric_card("Total Unhealthy Days", str(total_unhealthy), sub=f"in {range_label}"),
                unsafe_allow_html=True)

st.markdown("<div style='margin-top:24px;'></div>", unsafe_allow_html=True)

# ── Trendline ─────────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:8px;">Monthly Trends — {active_state} ({range_label})</h3>',
            unsafe_allow_html=True)

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x_pm25, y=y_pm25,
    name="PM2.5", mode="lines+markers",
    line=dict(color=PRIMARY, width=2.5),
    marker=dict(size=7, color=PRIMARY),
    hovertemplate="<b>%{x}</b><br>PM2.5: %{y:.1f}<extra></extra>",
))
fig.add_trace(go.Scatter(
    x=x_pm25, y=y_ozone,
    name="Ozone", mode="lines+markers",
    line=dict(color="#F5C842", width=2.5),
    marker=dict(size=7, color="#F5C842"),
    hovertemplate="<b>%{x}</b><br>Ozone: %{y:.1f}<extra></extra>",
))
fig.update_layout(**chart_layout(height=280, yaxis_title="Avg AQI"))
st.plotly_chart(fig, use_container_width=True)

st.markdown("<div style='margin-top:8px;'></div>", unsafe_allow_html=True)

# ── Heatmaps ──────────────────────────────────────────────────────────────────
heat_year = active_to if not single_year else active_from
h1, h2 = st.columns(2, gap="large")

with h1:
    st.markdown(
        monthly_aqi_heatmap(monthly, "pm25_avg_aqi", title=f"PM2.5 AQI — {heat_year}"),
        unsafe_allow_html=True,
    )

with h2:
    st.markdown(
        monthly_unhealthy_heatmap(monthly, "Unhealthy_days", title=f"Unhealthy Days — {heat_year}"),
        unsafe_allow_html=True,
    )

render_footer()
