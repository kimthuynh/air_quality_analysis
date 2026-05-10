import streamlit as st

st.set_page_config(
    page_title="EPA AQI Dashboard",
    page_icon="🌬️",
    layout="wide",
    initial_sidebar_state="expanded",
)

pg = st.navigation([
    st.Page("pages/overview.py",    title="Overview",    icon="📊"),
    st.Page("pages/state_level.py", title="State Level", icon="🗺️"),
    st.Page("pages/about.py",       title="About",       icon="ℹ️"),
])
pg.run()
