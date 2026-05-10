import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from utils import (
    load_data, apply_theme, render_footer, metric_card,
    monthly_aqi_heatmap, chart_layout,
    STATE_ABBREV, AQI_COLORSCALE, MONTH_NAMES,
    BG, CARD, PRIMARY, TEXT, TEXT2, BORDER,
)

apply_theme()

df = load_data()
years = sorted(df["Year"].unique(), reverse=True)

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown(f'<div style="color:{TEXT};font-size:18px;font-weight:700;margin-bottom:16px;">Filters</div>',
                unsafe_allow_html=True)
    selected_year = st.selectbox("Year", years, index=0)

# ── Data prep ─────────────────────────────────────────────────────────────────
df_year = df[df["Year"] == selected_year]
df_prev = df[df["Year"] == selected_year - 1]

avg_pm25  = df_year["pm25_avg_aqi"].mean()
avg_ozone = df_year["ozone_avg_aqi"].mean()

yoy_pm25  = (avg_pm25  - df_prev["pm25_avg_aqi"].mean())  if len(df_prev) else None
yoy_ozone = (avg_ozone - df_prev["ozone_avg_aqi"].mean()) if len(df_prev) else None

state_unhealthy      = df_year.groupby("State_name")["Unhealthy_days"].sum()
state_very_unhealthy = df_year.groupby("State_name")["Very_unhealthy_days"].sum()
top_unhealthy        = state_unhealthy.idxmax()      if len(state_unhealthy)      else "N/A"
top_very_unhealthy   = state_very_unhealthy.idxmax() if len(state_very_unhealthy) else "N/A"
top_unhealthy_days   = int(state_unhealthy.max())    if len(state_unhealthy)      else 0
top_very_days        = int(state_very_unhealthy.max()) if len(state_very_unhealthy) else 0

national_monthly = (
    df_year.groupby("Month")[["pm25_avg_aqi","ozone_avg_aqi"]]
    .mean().reset_index()
)

state_avg = (
    df_year.groupby("State_name")["pm25_avg_aqi"]
    .mean().reset_index()
)
state_avg["abbrev"] = state_avg["State_name"].map(STATE_ABBREV)
state_avg = state_avg.dropna(subset=["abbrev"])

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown(
    f'<h1 style="color:{TEXT};margin-bottom:4px;">🌬️ US Air Quality Dashboard</h1>',
    unsafe_allow_html=True,
)
st.markdown(
    f'<p style="color:{TEXT2};font-size:15px;margin-top:0;max-width:760px;">'
    "Air pollution has measurable effects on public health — even short-term exposure to elevated "
    "PM2.5 or Ozone can trigger respiratory and cardiovascular events. This dashboard summarizes "
    "EPA monitoring data (2023–2025) across all US states so you can track national trends, "
    "identify the worst-performing regions, and compare year-over-year changes."
    "</p>",
    unsafe_allow_html=True,
)

with st.expander("How to use this dashboard"):
    st.markdown(
        f"""
<div style="color:{TEXT2};line-height:1.7;font-size:14px;">
<b style="color:{TEXT};">1. Pick a year</b> — use the sidebar dropdown to switch between 2023, 2024, and 2025.<br>
<b style="color:{TEXT};">2. Read the scorecards</b> — the top row shows national averages and year-over-year changes.<br>
<b style="color:{TEXT};">3. Explore the map</b> — hover any state to see its average PM2.5 AQI for the selected year.<br>
<b style="color:{TEXT};">4. Spot seasonal patterns</b> — the heatmap shows which months had the worst air quality nationally.
</div>""",
        unsafe_allow_html=True,
    )

st.markdown("<div style='margin-top:16px;'></div>", unsafe_allow_html=True)

# ── Scorecards ────────────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.markdown(
        metric_card("Avg PM2.5 AQI", f"{avg_pm25:.1f}", delta=yoy_pm25),
        unsafe_allow_html=True,
    )
with c2:
    st.markdown(
        metric_card("Avg Ozone AQI", f"{avg_ozone:.1f}", delta=yoy_ozone),
        unsafe_allow_html=True,
    )
with c3:
    st.markdown(
        metric_card(
            "Most Unhealthy Days",
            top_unhealthy,
            sub=f"{top_unhealthy_days} days",
        ),
        unsafe_allow_html=True,
    )
with c4:
    st.markdown(
        metric_card(
            "Most Very Unhealthy Days",
            top_very_unhealthy,
            sub=f"{top_very_days} days",
        ),
        unsafe_allow_html=True,
    )

st.markdown("<div style='margin-top:24px;'></div>", unsafe_allow_html=True)

# ── Trendline ─────────────────────────────────────────────────────────────────
st.markdown(f'<h3 style="color:{TEXT};margin-bottom:8px;">Monthly Trends — {selected_year}</h3>',
            unsafe_allow_html=True)

fig_trend = go.Figure()
x_labels = national_monthly["Month"].map(lambda m: MONTH_NAMES[m - 1])
fig_trend.add_trace(go.Scatter(
    x=x_labels, y=national_monthly["pm25_avg_aqi"],
    name="PM2.5", mode="lines+markers",
    line=dict(color=PRIMARY, width=2.5),
    marker=dict(size=7, color=PRIMARY),
    hovertemplate="<b>%{x}</b><br>PM2.5: %{y:.1f}<extra></extra>",
))
fig_trend.add_trace(go.Scatter(
    x=x_labels, y=national_monthly["ozone_avg_aqi"],
    name="Ozone", mode="lines+markers",
    line=dict(color="#F5C842", width=2.5),
    marker=dict(size=7, color="#F5C842"),
    hovertemplate="<b>%{x}</b><br>Ozone: %{y:.1f}<extra></extra>",
))
fig_trend.update_layout(
    **chart_layout(height=280, title=None),
    yaxis_title="Avg AQI",
)
st.plotly_chart(fig_trend, use_container_width=True)

st.markdown("<div style='margin-top:8px;'></div>", unsafe_allow_html=True)

# ── Map + Heatmap ─────────────────────────────────────────────────────────────
col_map, col_heat = st.columns([3, 2], gap="large")

with col_map:
    st.markdown(f'<h3 style="color:{TEXT};margin-bottom:8px;">PM2.5 AQI by State — {selected_year}</h3>',
                unsafe_allow_html=True)
    hover_text = state_avg.apply(
        lambda r: f"<b>{r['State_name']}</b><br>PM2.5 AQI: {r['pm25_avg_aqi']:.1f}", axis=1
    )
    fig_map = go.Figure(data=go.Choropleth(
        locations=state_avg["abbrev"],
        z=state_avg["pm25_avg_aqi"],
        locationmode="USA-states",
        colorscale=AQI_COLORSCALE,
        zmin=0, zmax=300,
        text=hover_text,
        hovertemplate="%{text}<extra></extra>",
        colorbar=dict(
            title=dict(text="PM2.5<br>AQI", font=dict(color=TEXT2, size=12)),
            tickvals=[0, 50, 100, 150, 200, 300],
            ticktext=["0", "50", "100", "150", "200", "300"],
            bgcolor=CARD,
            tickfont=dict(color=TEXT2, size=11),
            thickness=14,
            len=0.85,
        ),
        marker_line_color="rgba(255,255,255,0.25)",
        marker_line_width=0.6,
    ))
    fig_map.update_layout(
        geo=dict(
            scope="usa",
            bgcolor=BG,
            lakecolor=BG,
            landcolor=CARD,
            coastlinecolor="rgba(255,255,255,0.2)",
            showlakes=True, showcoastlines=True,
        ),
        paper_bgcolor=CARD,
        font=dict(color=TEXT),
        margin=dict(l=0, r=0, t=0, b=0),
        height=420,
    )
    st.plotly_chart(fig_map, use_container_width=True)

with col_heat:
    st.markdown(f'<h3 style="color:{TEXT};margin-bottom:8px;">Monthly Heatmap — {selected_year}</h3>',
                unsafe_allow_html=True)
    st.markdown(
        monthly_aqi_heatmap(national_monthly, "pm25_avg_aqi", title="National Avg PM2.5 AQI"),
        unsafe_allow_html=True,
    )

render_footer()
