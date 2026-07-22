import { useState, useRef } from 'react'
import { useToast } from './Toast.jsx'
import { API_BASE } from '../api.js'
import { csrfStore } from '../csrfStore.js'
import RestoreModal from './RestoreModal.jsx'

const countryToCurrency = {
  US: 'USD', UA: 'UAH', DZ: 'DZD', TR: 'TRY',
  GB: 'GBP', EU: 'EUR', CA: 'CAD', AU: 'AUD'
}

const currencyNames = {
  USD: 'US Dollar', DZD: 'Algerian Dinar', EUR: 'Euro',
  UAH: 'Ukrainian Hryvnia', TRY: 'Turkish Lira',
  GBP: 'British Pound', CAD: 'Canadian Dollar', AUD: 'Australian Dollar'
}

export default function DataManager({ isActive, metrics }) {
  const showMessage = useToast()
  
  const [showAllRates, setShowAllRates]         = useState(false)
  const [searchQuery, setSearchQuery]           = useState('')
  const [updatingRates, setUpdatingRates]       = useState(false)
  const [modalOpen, setModalOpen]               = useState(false)
  const [restoreFilename, setRestoreFilename]   = useState(null)
  const fileInputRef                            = useRef(null)

  const csrfHeader = (extra = {}) => ({
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfStore.get() ?? '',
    ...extra,
  })

  // Extract data from SSE metrics
  const exchangeRates = metrics?.ExchangeRates || metrics?.DataManager?.exchangeRates || null;
  const backups = metrics?.Backups || metrics?.DataManager?.backups || [];
  const settingsCountries = metrics?.Settings?.COUNTRIES || [];

  // Determine priority currencies based on settings
  const pC = settingsCountries.map(c => countryToCurrency[c]).filter(Boolean)
  if (!pC.includes('DZD')) pC.push('DZD')
  if (!pC.includes('USD')) pC.push('USD')
  const priorityCurrencies = pC;

  const updateExchangeRates = async () => {
    setUpdatingRates(true)
    try {
      const res = await fetch(`${API_BASE}/api/siri0/exchange-rates/update`, {
        method: 'POST', credentials: 'include', headers: csrfHeader(),
      })
      const data = await res.json()
      if (data.success) { showMessage('Exchange rates updated successfully (waiting for stream update...)'); }
      else showMessage('Update failed: ' + (data.error || 'Unknown error'), 'error')
    } catch { showMessage('Server connection error', 'error') }
    finally { setUpdatingRates(false) }
  }

  const currencies = exchangeRates ? Object.keys(exchangeRates).filter(k => k !== 'date').sort() : []
  const favs   = currencies.filter(c => priorityCurrencies.includes(c))
  const others = currencies.filter(c => !priorityCurrencies.includes(c))
  const filterCurrency = (cur) => !searchQuery || cur.toUpperCase().includes(searchQuery.toUpperCase())

  const backupData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/siri0/data/backup`, {
        method: 'POST', credentials: 'include', headers: csrfHeader(),
      })
      const data = await res.json()
      if (data.success) { showMessage('Backup requested (waiting for stream update...)'); }
      else showMessage('Backup failed: ' + data.error, 'error')
    } catch (err) { showMessage('Error: ' + err.message, 'error') }
  }

  const downloadBackup = (filename) => {
    window.location.href = `${API_BASE}/api/siri0/data/backup?file=${encodeURIComponent(filename)}`
  }

  const deleteBackup = async (filename) => {
    if (!confirm(`Delete backup "${filename}"?`)) return
    try {
      const res = await fetch(`${API_BASE}/api/siri0/data/delete-backup`, {
        method: 'POST', credentials: 'include', headers: csrfHeader(),
        body: JSON.stringify({ filename }),
      })
      const data = await res.json()
      if (data.success) { showMessage('Backup deleted (waiting for stream update...)'); }
      else showMessage('Delete failed: ' + data.error, 'error')
    } catch (err) { showMessage('Error: ' + err.message, 'error') }
  }

  const resetCheckpoint = async () => {
    if (!confirm('This will delete last_id.json and restart the crawler from scratch. Continue?')) return
    try {
      const res = await fetch(`${API_BASE}/api/siri0/data/reset-checkpoint`, {
        method: 'POST', credentials: 'include', headers: csrfHeader(),
      })
      const data = await res.json()
      if (data.success) showMessage('Checkpoint reset successfully')
      else showMessage('Failed: ' + data.error, 'error')
    } catch (err) { showMessage('Error: ' + err.message, 'error') }
  }

  const clearLogFile = async () => {
    if (!confirm('This will clear system.log entirely. Continue?')) return
    try {
      const res = await fetch(`${API_BASE}/api/siri0/data/clear-log`, {
        method: 'POST', credentials: 'include', headers: csrfHeader(),
      })
      const data = await res.json()
      if (data.success) showMessage('Log cleared')
      else showMessage('Failed: ' + data.error, 'error')
    } catch (err) { showMessage('Error: ' + err.message, 'error') }
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API_BASE}/api/siri0/settings/import`, {
        method: 'POST', credentials: 'include',
        headers: { 'X-CSRF-Token': csrfStore.get() ?? '' },
        body: formData,
      })
      const data = await res.json()
      if (data.success) { showMessage('Settings imported successfully'); e.target.value = '' }
      else showMessage('Import failed: ' + data.error, 'error')
    } catch (err) { showMessage('Error: ' + err.message, 'error') }
  }

  const RateCard = ({ cur, isPriority }) => {
    if (!filterCurrency(cur)) return null
    const val = exchangeRates[cur]
    return (
      <div className={`rate-item ${isPriority ? 'priority' : ''}`}>
        <span className="currency">{cur}</span>
        <span className="value">{typeof val === 'number' ? val.toFixed(4) : val}</span>
        <span className="currency-name">{currencyNames[cur] || ''}</span>
      </div>
    )
  }

  if (!isActive) return null;

  return (
    <div id="data" className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-database" /> Data Management
        </h2>
      </div>

      <div className="data-management-grid">
        {/* Exchange rates */}
        <div className="management-card currency-card card-glass">
          <div className="card-title"><i className="fas fa-coins" /> Exchange Rates</div>
          <div className="card-body">
            <div className="search-bar-modern">
              <i className="fas fa-search" />
              <input type="text" className="form-control" placeholder="Search currency..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '36px' }} />
            </div>
            <div className="exchange-content-area">
              {!exchangeRates ? (
                <div style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>
                  <i className="fas fa-spinner fa-pulse" /> Waiting for rates stream...
                </div>
              ) : (
                <>
                  <div className="rates-header"><span>Last updated: {exchangeRates.date || 'Unknown'}</span></div>
                  {favs.length > 0 && (
                    <div className="rates-group">
                      <div className="rates-section-title"><i className="fas fa-star" /> Priority currencies</div>
                      <div className="rates-grid">{favs.map(cur => <RateCard key={cur} cur={cur} isPriority />)}</div>
                    </div>
                  )}
                  {others.length > 0 && (
                    <>
                      <div className={`rates-group ${!showAllRates ? 'hidden' : ''}`} style={{ marginTop: '20px' }}>
                        <div className="rates-section-title"><i className="fas fa-globe" /> Other currencies</div>
                        <div className="rates-grid">{others.map(cur => <RateCard key={cur} cur={cur} isPriority={false} />)}</div>
                      </div>
                      <button className="toggle-rates-btn" onClick={() => setShowAllRates(!showAllRates)}>
                        <i className={`fas fa-chevron-${showAllRates ? 'up' : 'down'}`} />
                        <span>{showAllRates ? 'Hide extra currencies' : `Show all currencies (${others.length})`}</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <button className="btn btn-primary btn-block" onClick={updateExchangeRates} disabled={updatingRates}>
              {updatingRates
                ? <><i className="fas fa-spinner fa-spin" /> Updating...</>
                : <><i className="fas fa-sync-alt" /> Update Rates Now</>
              }
            </button>
          </div>
        </div>

        {/* Backups */}
        <div className="management-card backup-card card-glass">
          <div className="card-title"><i className="fas fa-shield-alt" /> Data Security & Backups</div>
          <div className="card-body">
            <div className="backups-scroll-list">
              {!metrics ? (
                <div className="backup-item" style={{justifyContent: 'center'}}><i className="fas fa-spinner fa-pulse" /> Waiting for stream...</div>
              ) : backups.length === 0 ? (
                <div className="backup-item" style={{justifyContent: 'center'}}>No backups available.</div>
              ) : (
                backups.map(b => (
                  <div key={b.name} className="backup-item">
                    <div className="backup-info">
                      <div className="backup-name">{b.name}</div>
                      <div className="backup-meta">
                        <span>📦 {b.size}</span>
                        <span>🕒 {b.modified}</span>
                      </div>
                    </div>
                    <div className="backup-actions">
                      <button className="btn btn-info btn-sm" onClick={() => downloadBackup(b.name)}>📥 Download</button>
                      <button className="btn btn-warning btn-sm" onClick={() => { setRestoreFilename(b.name); setModalOpen(true) }}>🔧 Partial Restore</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteBackup(b.name)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="btn btn-success btn-block" onClick={backupData}>
              <i className="fas fa-plus-circle" /> Create Backup Now
            </button>
          </div>
        </div>

        {/* Maintenance tools */}
        <div className="management-card tools-card card-glass">
          <div className="card-title"><i className="fas fa-tools" /> Maintenance Tools</div>
          <div className="card-body tools-list-modern">
            <div className="tool-item-modern">
              <div className="tool-info"><h5><i className="fas fa-undo" /> Reset Checkpoint</h5><p>Start crawler from scratch</p></div>
              <button className="btn btn-warning btn-sm" onClick={resetCheckpoint}>Reset</button>
            </div>
            <div className="tool-item-modern">
              <div className="tool-info"><h5><i className="fas fa-eraser" /> Clear Log File</h5><p>Wipe system.log</p></div>
              <button className="btn btn-danger btn-sm" onClick={clearLogFile}>Clear</button>
            </div>
            <div className="tool-item-modern">
              <div className="tool-info"><h5><i className="fas fa-file-import" /> Import Settings</h5><p>Upload JSON file</p></div>
              <input type="file" ref={fileInputRef} hidden onChange={handleImportFile} />
              <button className="btn btn-info btn-sm" onClick={() => fileInputRef.current?.click()}>Upload</button>
            </div>
          </div>
        </div>
      </div>

      <RestoreModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setRestoreFilename(null) }}
        filename={restoreFilename}
        // Instead of triggering a GET load, we just wait for SSE to stream it.
        onRestoreComplete={() => { showMessage('Restore command sent', 'success') }}
      />
    </div>
  )
}
