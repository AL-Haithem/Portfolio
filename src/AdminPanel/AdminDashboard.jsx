// AdminDashboard — main shell for the admin panel
// • On mount: if csrfStore is empty → fetch /api/vv/adm/csrf to revalidate session
//             If that fails (401/403/network) → redirect to /admin/login
// • Renders the full admin UI (Sidebar + sections) using the Temp design
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { API_BASE }  from '../api.js'
import { csrfStore } from '../csrfStore.js'

import { ToastProvider } from './Toast.jsx'
import Sidebar      from './Sidebar.jsx'
import Dashboard    from './Dashboard.jsx'
import Crawler      from './Crawler.jsx'
import CacheStats   from './CacheStats.jsx'
import SystemStats  from './SystemStats.jsx'
import Settings     from './Settings.jsx'
import DataManager  from './DataManager.jsx'
import Logs         from './Logs.jsx'
import NotFound     from '../NotFound.jsx'

// Admin panel CSS (copied from Temp)
import '../CompCss/admin.css'

// ─── Auth guard ───────────────────────────────────────────────────────────────
async function revalidateSession() {
  // The backend /api/auth/csrf endpoint:
  // - Requires a valid JWT cookie (Protection middleware)
  // - Returns { csrfToken } on success, or 401/403 on failure
  const res = await fetch(`${API_BASE}/api/auth/csrf`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Not authenticated')
  const data = await res.json()
  return data.csrfToken ?? null
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [authChecked, setAuthChecked] = useState(false)
  const [authFailed, setAuthFailed] = useState(false)
  
  // Global SSE metrics state
  const [systemMetrics, setSystemMetrics] = useState(null)
  const [sseStatus, setSseStatus] = useState('connecting')

  // Default to 'dashboard' if no tab is in the URL
  const activeSection = searchParams.get('tab') || 'dashboard'

  const handleSectionChange = (section) => {
    setSearchParams({ tab: section })
  }

  // ── Session guard on mount ──────────────────────────────────────────────────
  useEffect(() => {
    // If CSRF token is already in memory (same tab, logged in), skip the network check
    if (csrfStore.isSet()) {
      setAuthChecked(true)
      return
    }

    // Token missing (page reload) → ask the server
    revalidateSession()
      .then((token) => {
        if (token) csrfStore.set(token)
        setAuthChecked(true)
      })
      .catch(() => {
        // Not authenticated → pretend route doesn't exist
        csrfStore.clear()
        setAuthFailed(true)
      })
  }, [navigate])

  // ── Global SSE Connection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked || authFailed) return;

    let sse;
    setSseStatus('connecting');
    
    try {
      sse = new EventSource(`${API_BASE}/api/vv/adm/dashboard`, { withCredentials: true });
      
      sse.onopen = () => setSseStatus('connected');
      
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSystemMetrics(data);
        } catch (e) {
          console.error('SSE Parse Error:', e);
        }
      };
      
      sse.onerror = (err) => {
        setSseStatus('error');
      };
    } catch (err) {
      setSseStatus('error');
    }

    return () => {
      if (sse) sse.close();
    };
  }, [authChecked, authFailed]);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfStore.get() ?? '',
        },
      })
    } catch {
      // Ignore network errors — clear state and redirect regardless
    } finally {
      csrfStore.clear()
      navigate('/admin/login', { replace: true })
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (authFailed) {
    return <NotFound />
  }

  if (!authChecked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: '#fff' }}>
        {/* Intentionally blank to avoid flashing text before returning NotFound */}
      </div>
    )
  }

  // ── Admin Panel UI ──────────────────────────────────────────────────────────
  return (
    <ToastProvider>
      <div id="adminApp">
        <div className="bg-glow" />

        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onLogout={handleLogout}
        />

        <div className="main-content">
          <Dashboard    isActive={activeSection === 'dashboard'} />
          <SystemStats  isActive={activeSection === 'system'} metrics={systemMetrics} connectionStatus={sseStatus} />
          <Crawler      isActive={activeSection === 'crawler'} metrics={systemMetrics} />
          <CacheStats   isActive={activeSection === 'cache'}     metrics={systemMetrics} />
          <Settings     isActive={activeSection === 'settings'} metrics={systemMetrics} />
          <DataManager  isActive={activeSection === 'data'}     metrics={systemMetrics} />
          <Logs         isActive={activeSection === 'logs'}     metrics={systemMetrics} />
        </div>
      </div>
    </ToastProvider>
  )
}
