import React from 'react'

export default function SystemStats({ isActive, metrics, connectionStatus }) {

  if (!isActive) return null;

  return (
    <div className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-microchip"></i>
          System Monitoring
          <span className="subtitle">Real-time server metrics stream via SSE</span>
        </h2>
        <div className="server-status-mini" style={{ padding: '6px 12px', background: 'var(--surface-color)', borderRadius: '20px' }}>
          <span className={`status-dot ${connectionStatus === 'connected' ? 'online' : connectionStatus === 'connecting' ? 'warning' : 'error'}`}></span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {connectionStatus === 'connected' ? 'Live Stream Active' : connectionStatus === 'connecting' ? 'Connecting...' : 'Stream Disconnected'}
          </span>
        </div>
      </div>

      {!metrics && connectionStatus === 'connecting' && <div className="loading-shimmer">Connecting to telemetry stream...</div>}
      
      {!metrics && connectionStatus === 'error' && (
        <div className="settings-message error" style={{position:'static', transform:'none', margin:'20px 0'}}>
          Failed to connect to the monitoring stream.
        </div>
      )}

      {metrics && (
        <div className="dashboard-grid">
          {Object.entries(metrics).map(([key, value]) => {
            // Optional: Skip time if you don't want a card for it, though rendering it is fine.
            if (key === 'Time') return null;

            return (
              <div key={key} className="card-glass dashboard-group">
                <div className="group-title" style={{ textTransform: 'capitalize' }}>
                  <i className="fas fa-chart-bar"></i> {key.replace(/_/g, ' ')}
                </div>
                <div className="stats-mini-grid" style={{ gridTemplateColumns: typeof value === 'object' && value !== null ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr' }}>
                  {renderMetricContent(value)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function renderMetricContent(value) {
  if (value === null || value === undefined) {
    return <StatCard label="Value" value="N/A" />;
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    // If the object is empty, show N/A
    if (Object.keys(value).length === 0) {
      return <StatCard label="Status" value="Waiting for data..." />;
    }

    return Object.entries(value).map(([k, v]) => {
      let formattedValue = String(v);
      if (typeof v === 'number') {
        formattedValue = v % 1 !== 0 ? v.toFixed(2) : String(v);
      }
      
      // If the value itself is a nested object (like Http.StatusCodes or System.RAM)
      if (typeof v === 'object' && v !== null) {
        if (Object.keys(v).length === 0) return null; // hide empty nested objects

        return (
          <div key={k} style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'capitalize' }}>{k}</div>
            <div className="stats-mini-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
              {Object.entries(v).map(([subK, subV]) => {
                let subFormatted = String(subV);
                if (typeof subV === 'number') {
                  subFormatted = subV % 1 !== 0 ? subV.toFixed(2) : String(subV);
                }
                // Format bytes to MB for known RAM/Heap properties
                if (['Used', 'Free', 'Total', 'RSS'].includes(subK) || ['Used', 'Free', 'Total', 'RSS'].includes(k)) {
                   if (typeof subV === 'number' && subV > 1024) {
                     subFormatted = (subV / 1024 / 1024).toFixed(2) + ' MB';
                   }
                }
                return <StatCard key={subK} label={subK.replace(/_/g, ' ')} value={subFormatted} />
              })}
            </div>
          </div>
        )
      }

      return <StatCard key={k} label={k.replace(/_/g, ' ')} value={formattedValue} />
    });
  }
  
  return <StatCard label="Value" value={String(value)} />;
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card-modern">
      <span className="label" style={{ textTransform: 'capitalize' }}>{label}</span>
      <span className="value">{value}</span>
    </div>
  )
}
