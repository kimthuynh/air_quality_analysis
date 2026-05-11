import { Outlet, NavLink } from 'react-router-dom';
import { BarChart3, Map, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Logo from './Logo';
import { THEME } from '../theme';

const NAV: { to: string; Icon: LucideIcon; label: string }[] = [
  { to: '/overview', Icon: BarChart3, label: 'Overview' },
  { to: '/state',    Icon: Map,       label: 'State Level' },
  { to: '/about',    Icon: Info,      label: 'About' },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: THEME.bg }}>
      <aside
        className="flex flex-col w-56 shrink-0 border-r"
        style={{ background: '#0A0E14', borderColor: THEME.border }}
      >
        <div
          className="px-5 py-5 border-b flex items-center gap-3"
          style={{ borderColor: THEME.border }}
        >
          <Logo size={28} />
          <div>
            <div className="text-sm font-bold" style={{ color: THEME.textPrimary }}>EPA AQI</div>
            <div className="text-xs" style={{ color: THEME.textSecondary }}>Dashboard</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {NAV.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={({ isActive }) =>
                isActive
                  ? { background: 'rgba(58,200,255,0.12)', color: THEME.primary }
                  : { color: THEME.textSecondary }
              }
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
