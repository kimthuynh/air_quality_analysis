import os
import pandas as pd
import streamlit as st

DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app", "data", "Monthly_aqi_by_state.csv")

MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

STATE_ABBREV = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY",
    "District Of Columbia": "DC", "District of Columbia": "DC",
    "Puerto Rico": "PR",
}

AQI_LEVELS = [
    (50,           "#00C49A", "Good",                    "0–50"),
    (100,          "#F5C842", "Moderate",                "51–100"),
    (150,          "#FF9A3C", "Unhealthy for Sensitive", "101–150"),
    (200,          "#E05C5C", "Unhealthy",               "151–200"),
    (300,          "#A855F7", "Very Unhealthy",          "201–300"),
    (float("inf"), "#7F1D1D", "Hazardous",               "300+"),
]

# Step colorscale for Plotly choropleth (zmin=0, zmax=300)
AQI_COLORSCALE = [
    [0.0000, "#00C49A"], [0.1665, "#00C49A"],
    [0.1666, "#F5C842"], [0.3331, "#F5C842"],
    [0.3332, "#FF9A3C"], [0.4997, "#FF9A3C"],
    [0.4998, "#E05C5C"], [0.6663, "#E05C5C"],
    [0.6664, "#A855F7"], [1.0000, "#A855F7"],
]

BG        = "#344152"
CARD      = "#2D3748"
PRIMARY   = "#2CC8ED"
TEXT      = "#F0F4F8"
TEXT2     = "#A0B0C0"
BORDER    = "rgba(255,255,255,0.10)"
FOOTER_BG = "#1E2A38"


@st.cache_data
def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip() for c in df.columns]
    return df


def get_aqi_color(value) -> str:
    if pd.isna(value):
        return "#4A5568"
    for threshold, color, *_ in AQI_LEVELS:
        if value <= threshold:
            return color
    return "#7F1D1D"


def apply_theme():
    st.markdown(f"""
    <style>
      body, .stApp {{ background-color:{BG}; }}
      .stApp > header {{ background-color:{BG}; }}
      [data-testid="stSidebar"] {{
        background-color:{CARD};
        border-right:1px solid {BORDER};
      }}
      [data-testid="stSidebar"] p,
      [data-testid="stSidebar"] span,
      [data-testid="stSidebar"] label,
      [data-testid="stSidebar"] div {{
        color:{TEXT2} !important;
      }}
      [data-testid="stSidebar"] a {{ color:{PRIMARY} !important; }}
      h1,h2,h3,h4 {{ color:{TEXT}; }}
      p,li {{ color:{TEXT2}; }}
      .stSelectbox label, .stMultiSelect label, .stDateInput label {{ color:{TEXT2} !important; font-size:13px !important; }}
      div[data-baseweb="select"] > div {{
        background-color:{CARD} !important;
        border-color:{BORDER} !important;
        color:{TEXT} !important;
      }}
      div[data-baseweb="select"] * {{ color:{TEXT} !important; }}
      .stButton > button {{
        background-color:{PRIMARY} !important;
        color:#0a1628 !important;
        border:none !important;
        border-radius:6px !important;
        font-weight:700 !important;
      }}
      .stButton > button:hover {{ background-color:#1FA8C9 !important; }}
      .block-container {{ padding-bottom:70px !important; }}
      #MainMenu,footer,.stDeployButton {{ visibility:hidden; display:none; }}
      .footer {{
        position:fixed; bottom:0; left:0; right:0;
        background:{FOOTER_BG};
        padding:10px 28px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:12px;
        color:{TEXT2};
        z-index:9999;
        border-top:1px solid {BORDER};
      }}
      .footer a {{ color:{PRIMARY}; text-decoration:none; }}
    </style>
    """, unsafe_allow_html=True)


def render_footer():
    st.markdown("""
    <div class="footer">
      <span>EPA AQI Dashboard &middot; 2023&ndash;2025</span>
      <a href="https://www.epa.gov/outdoor-air-quality-data" target="_blank">
        Data: US Environmental Protection Agency &middot; Air Quality Data &#8599;
      </a>
    </div>
    """, unsafe_allow_html=True)


def metric_card(label: str, value: str, delta=None, sub: str = "") -> str:
    delta_html = ""
    if delta is not None and not pd.isna(delta):
        arrow = "▲" if delta > 0 else "▼"
        col = "#E05C5C" if delta > 0 else "#00C49A"
        sign = f"{delta:+.1f}"
        delta_html = f'<div style="color:{col};font-size:13px;margin-top:5px;">{arrow} {sign} YoY</div>'
    sub_html = f'<div style="color:{TEXT2};font-size:12px;margin-top:4px;">{sub}</div>' if sub else ""
    return f"""
    <div style="background:{CARD};border-radius:10px;padding:16px 18px;
                border:1px solid {BORDER};height:100%;box-sizing:border-box;">
      <div style="color:{TEXT2};font-size:11px;text-transform:uppercase;letter-spacing:.07em;">{label}</div>
      <div style="color:{TEXT};font-size:26px;font-weight:700;margin-top:6px;">{value}</div>
      {delta_html}{sub_html}
    </div>"""


def aqi_legend_html(compact=False) -> str:
    size = "10px" if compact else "12px"
    pills = "".join(
        f'<span style="background:{color};color:white;padding:4px 10px;'
        f'border-radius:20px;font-size:{size};white-space:nowrap;">{label} {rng}</span>'
        for _, color, label, rng in AQI_LEVELS
    )
    return f'<div style="display:flex;gap:6px;flex-wrap:wrap;">{pills}</div>'


def monthly_aqi_heatmap(monthly: pd.DataFrame, value_col: str, title: str = "") -> str:
    """3×4 grid colored by AQI level."""
    html = ""
    if title:
        html += f'<div style="color:{TEXT};font-size:14px;font-weight:600;margin-bottom:10px;">{title}</div>'
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">'
    for m in range(1, 13):
        name = MONTH_NAMES[m - 1]
        row = monthly[monthly["Month"] == m]
        if len(row) and not pd.isna(row[value_col].values[0]):
            val = row[value_col].values[0]
            bg = get_aqi_color(val)
            vs = f"{val:.1f}"
        else:
            bg, vs = "#4A5568", "N/A"
        html += (
            f'<div style="background:{bg};border-radius:6px;padding:10px 6px;'
            f'text-align:center;color:white;">'
            f'<div style="font-size:11px;opacity:.85;">{name}</div>'
            f'<div style="font-size:16px;font-weight:700;margin-top:2px;">{vs}</div></div>'
        )
    html += "</div>"
    html += f'<div style="margin-top:10px;">{aqi_legend_html(compact=True)}</div>'
    return html


def monthly_unhealthy_heatmap(monthly: pd.DataFrame, value_col: str, title: str = "") -> str:
    """3×4 grid colored from light-red → deep-red by day count."""
    max_val = monthly[value_col].max() if len(monthly) else 1
    max_val = max(max_val, 1)

    def _color(v):
        if pd.isna(v) or v == 0:
            return "#2A3D4F"
        r = min(v / max_val, 1.0)
        red   = int(255)
        green = int(205 - r * 185)
        blue  = int(210 - r * 200)
        return f"rgb({red},{green},{blue})"

    html = ""
    if title:
        html += f'<div style="color:{TEXT};font-size:14px;font-weight:600;margin-bottom:10px;">{title}</div>'
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">'
    for m in range(1, 13):
        name = MONTH_NAMES[m - 1]
        row = monthly[monthly["Month"] == m]
        if len(row):
            val = row[value_col].values[0]
            bg = _color(val)
            vs = "0" if pd.isna(val) else str(int(val))
        else:
            bg, vs = "#4A5568", "N/A"
        html += (
            f'<div style="background:{bg};border-radius:6px;padding:10px 6px;'
            f'text-align:center;color:white;">'
            f'<div style="font-size:11px;opacity:.85;">{name}</div>'
            f'<div style="font-size:16px;font-weight:700;margin-top:2px;">{vs}</div></div>'
        )
    html += "</div>"
    html += (
        f'<div style="display:flex;align-items:center;gap:8px;margin-top:10px;">'
        f'<span style="font-size:11px;color:{TEXT2};">0 days</span>'
        f'<div style="flex:1;height:10px;border-radius:4px;'
        f'background:linear-gradient(to right,#FFD6D6,#FF0000);"></div>'
        f'<span style="font-size:11px;color:{TEXT2};">Most days ({int(max_val)})</span>'
        f'</div>'
    )
    return html


def chart_layout(**overrides) -> dict:
    base = dict(
        paper_bgcolor=CARD,
        plot_bgcolor=BG,
        font=dict(color=TEXT, size=12),
        margin=dict(l=10, r=10, t=40, b=10),
        legend=dict(bgcolor="rgba(0,0,0,0)", font=dict(color=TEXT)),
        xaxis=dict(
            gridcolor="rgba(255,255,255,0.07)",
            linecolor="rgba(255,255,255,0.15)",
            tickfont=dict(color=TEXT2),
            titlefont=dict(color=TEXT2),
        ),
        yaxis=dict(
            gridcolor="rgba(255,255,255,0.07)",
            linecolor="rgba(255,255,255,0.15)",
            tickfont=dict(color=TEXT2),
            titlefont=dict(color=TEXT2),
        ),
    )
    base.update(overrides)
    return base
