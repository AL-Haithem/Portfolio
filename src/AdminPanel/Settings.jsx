import { useState, useEffect } from 'react'
import { useToast } from './Toast.jsx'
import { API_BASE } from '../api.js'
import { csrfStore } from '../csrfStore.js'

export default function Settings({ isActive, metrics }) {
  const showMessage   = useToast()
  
  // State for form inputs
  const [siteName, setSiteName]             = useState('')
  const [siteDescription, setSiteDescription] = useState('')
  const [usdtPrice, setUsdtPrice]           = useState('')
  const [countries, setCountries]           = useState('')
  const [proxies, setProxies]               = useState('')

  // Sync inputs with incoming metrics
  useEffect(() => {
    if (!metrics?.Settings) return;
    const s = metrics.Settings;
    
    // Only update state if it hasn't been edited locally (simplified approach)
    // For a robust system, you might want a "dirty" state or a sync button
    setSiteName(prev => prev || s.siteName || '');
    setSiteDescription(prev => prev || s.siteDescription || '');
    setUsdtPrice(prev => prev || s['USDT/DZD-Price'] || 250);
    setCountries(prev => prev || (s.COUNTRIES || []).join(', '));
    setProxies(prev => prev || (s.PROXIES || []).join(', '));
  }, [metrics?.Settings]);

  const csrfHeader = () => ({
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfStore.get() ?? '',
  })

  const saveSetting = async (field) => {
    let key, value
    switch (field) {
      case 'siteName':        key = 'siteName';        value = siteName; break
      case 'siteDescription': key = 'siteDescription'; value = siteDescription; break
      case 'usdtPrice':       key = 'USDT/DZD-Price';  value = parseFloat(usdtPrice); break
      case 'countries':       key = 'COUNTRIES';       value = countries.split(',').map(s => s.trim()).filter(Boolean); break
      case 'proxies':         key = 'PROXIES';         value = proxies.split(',').map(s => s.trim()).filter(Boolean); break
      default: return
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/siri0/settings`, {
        method: 'POST', credentials: 'include',
        headers: csrfHeader(),
        body: JSON.stringify({ [key]: value }),
      })
      const data = await res.json()
      if (data.success) showMessage('Setting saved successfully', 'success')
      else throw new Error(data.error || 'Save failed')
    } catch (err) {
      showMessage('Error saving setting: ' + err.message, 'error')
    }
  }

  const forceSync = () => {
    const s = metrics?.Settings;
    if (s) {
      setSiteName(s.siteName || '');
      setSiteDescription(s.siteDescription || '');
      setUsdtPrice(s['USDT/DZD-Price'] || 250);
      setCountries((s.COUNTRIES || []).join(', '));
      setProxies((s.PROXIES || []).join(', '));
      showMessage('Settings synced from live stream', 'success')
    } else {
      showMessage('Waiting for settings stream...', 'warning')
    }
  }

  if (!isActive) return null;

  return (
    <div id="settings" className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-sliders-h" /> System Settings
        </h2>
      </div>

      {!metrics?.Settings ? (
        <div className="settings-message" style={{position:'static', transform:'none', margin:'20px 0'}}>
          <i className="fas fa-spinner fa-pulse" style={{marginRight: '8px'}} /> Waiting for Settings stream...
        </div>
      ) : (
        <div className="settings-grid-layout">
          {/* Site identity */}
          <div className="settings-card shadow-soft card-glass">
            <h3 className="group-title"><i className="fas fa-id-card" /> Site Identity</h3>
            <div className="settings-form">
              <div className="form-group-modern">
                <label>Site Name</label>
                <div className="input-with-action">
                  <input type="text" className="form-control" placeholder="Enter site name..." value={siteName} onChange={e => setSiteName(e.target.value)} />
                  <button className="btn btn-success btn-xs" onClick={() => saveSetting('siteName')}>
                    <i className="fas fa-save" /> Save
                  </button>
                </div>
              </div>
              <div className="form-group-modern">
                <label>Site Description</label>
                <div className="input-with-action">
                  <textarea className="form-control" rows="2" placeholder="Short description..." value={siteDescription} onChange={e => setSiteDescription(e.target.value)} />
                  <button className="btn btn-success btn-xs" onClick={() => saveSetting('siteDescription')}>
                    <i className="fas fa-save" /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="settings-card shadow-soft card-glass">
            <h3 className="group-title"><i className="fas fa-money-bill-wave" /> Financial Settings</h3>
            <div className="settings-form">
              <div className="form-group-modern">
                <label>USDT/DZD Price</label>
                <div className="input-with-action">
                  <input type="number" className="form-control" placeholder="0.00" value={usdtPrice} onChange={e => setUsdtPrice(e.target.value)} />
                  <button className="btn btn-success btn-xs" onClick={() => saveSetting('usdtPrice')}>
                    <i className="fas fa-save" /> Save
                  </button>
                </div>
              </div>
              <div className="form-group-modern">
                <label>Supported Countries (ISO Codes)</label>
                <div className="input-with-action">
                  <input type="text" className="form-control" placeholder="US, DZ, FR..." value={countries} onChange={e => setCountries(e.target.value)} />
                  <button className="btn btn-success btn-xs" onClick={() => saveSetting('countries')}>
                    <i className="fas fa-save" /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Connection */}
          <div className="settings-card shadow-soft wide-card card-glass">
            <h3 className="group-title"><i className="fas fa-network-wired" /> Connection & Proxies</h3>
            <div className="settings-form">
              <div className="form-group-modern">
                <label>Proxy List</label>
                <div className="input-with-action">
                  <textarea className="form-control" rows="3" placeholder="http://user:pass@ip:port..." value={proxies} onChange={e => setProxies(e.target.value)} />
                  <button className="btn btn-success btn-xs" onClick={() => saveSetting('proxies')}>
                    <i className="fas fa-save" /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-actions-footer">
            <button className="btn btn-info btn-wide" onClick={forceSync}>
              <i className="fas fa-sync-alt" /> Force Sync from Stream
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
