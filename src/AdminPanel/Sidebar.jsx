// Sidebar — Admin Panel navigation
import { useState } from 'react'

const navItems = [
  { id: 'dashboard', icon: 'fas fa-chart-pie',    label: 'Dashboard' },
  { id: 'system',    icon: 'fas fa-microchip',    label: 'System' },
  { id: 'crawler',   icon: 'fas fa-robot',        label: 'Data Crawler' },
  { id: 'cache',     icon: 'fas fa-server',       label: 'Cache Memory' },
  { id: 'settings',  icon: 'fas fa-sliders-h',    label: 'Settings' },
  { id: 'data',      icon: 'fas fa-database',     label: 'Data Management' },
  { id: 'logs',      icon: 'fas fa-history',      label: 'Logs' },
]

export default function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (sectionId) => {
    onSectionChange(sectionId)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <i className="fas fa-bars" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay show"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <i className="fas fa-shield-halved" style={{ fontSize: '1.4rem', color: 'var(--accent-clr)' }} />
          <h3>Admin Panel</h3>
        </div>

        <div className="nav-group">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <i className={item.icon} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="server-status-mini">
            <span className="status-dot online" />
            <span>Server Online</span>
          </div>
          <button
            onClick={onLogout}
            style={{
              marginTop: '12px',
              width: '100%',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#f87171',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease',
            }}
          >
            <i className="fas fa-right-from-bracket" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
