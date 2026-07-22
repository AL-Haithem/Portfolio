import { useState, useEffect, useRef } from 'react'
import { API_BASE } from '../api.js'

function sizeFormat(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

function timeFormat(ms) {
  if (!ms || ms < 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const hours   = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
}

export default function Dashboard({ isActive, metrics }) {
  const [uptime, setUptime] = useState('00:00:00')
  const chartRef      = useRef(null)
  const chartInstance = useRef(null)

  const sys = metrics?.System || {}
  const dash = metrics?.Dashboard || {}
  const httpStats = metrics?.Http || {}
  
  // Real-time uptime counter
  useEffect(() => {
    // If backend provides ServerStartTime, use it for exact uptime. Otherwise use process.uptime if provided (in seconds)
    const startTimeMs = dash.ServerStartTime ? new Date(dash.ServerStartTime).getTime() : 
                        sys.Uptime ? Date.now() - (sys.Uptime * 1000) : null;
                        
    if (!startTimeMs) return;

    const interval = setInterval(() => {
      setUptime(timeFormat(Date.now() - startTimeMs))
    }, 1000)
    setUptime(timeFormat(Date.now() - startTimeMs))
    return () => clearInterval(interval)
  }, [dash.ServerStartTime, sys.Uptime])

  // Chart setup
  useEffect(() => {
    const chartData = dash.chartData || metrics?.chartData;
    if (chartData && chartRef.current && window.Chart) {
      if (chartInstance.current) {
        chartInstance.current.data = chartData
        chartInstance.current.update()
      } else {
        chartInstance.current = new window.Chart(chartRef.current, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
              x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
          }
        })
      }
    }
  }, [dash.chartData, metrics?.chartData])

  const total       = dash.TotalGames || 0
  const dataSize    = sizeFormat(dash.DBStorageSize || 0)
  const startTimeStr = dash.ServerStartTime ? new Date(dash.ServerStartTime).toLocaleString() : '--'
  
  const cpu = sys.CPU || 0;
  const ramPercent = sys.RAM?.Percent || 0;
  const ramUsed = sizeFormat(sys.RAM?.Used || 0);
  const ramTotal = sizeFormat(sys.RAM?.Total || 0);

  if (!isActive) return null;

  return (
    <div id="dashboard" className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-chart-pie" /> System Overview
        </h2>
      </div>

      <div className="dashboard-grid">
        {/* Hardware & Resources */}
        <div className="dashboard-group stats-group-card card-glass">
          <h3 className="group-title"><i className="fas fa-microchip" /> Hardware & Resources</h3>
          <div className="stats-mini-grid">
            {!metrics ? (
              <div className="stat-placeholder">
                <i className="fas fa-spinner fa-pulse" /> Waiting for data...
              </div>
            ) : (
              <>
                <div className="stat-card-modern" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="label">CPU Usage:</span>
                    <span className="value">{cpu}%</span>
                  </div>
                  <div className="progress-mini" style={{ height: '6px', marginTop: '8px' }}>
                    <div className="progress-mini-fill" style={{ width: `${cpu}%`, background: 'var(--accent-clr)' }} />
                  </div>
                </div>

                <div className="stat-card-modern" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="label">RAM Usage:</span>
                    <span className="value">{ramPercent}%</span>
                  </div>
                  <div className="progress-mini" style={{ height: '6px', marginTop: '8px' }}>
                    <div className="progress-mini-fill" style={{ width: `${ramPercent}%`, background: 'var(--success-clr)' }} />
                  </div>
                  <span className="label" style={{ fontSize: '0.7rem', marginTop: '6px', display: 'block' }}>
                    {ramUsed} / {ramTotal}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Network & Connection */}
        <div className="dashboard-group server-group-card card-glass">
          <h3 className="group-title"><i className="fas fa-network-wired" /> Network & Connection</h3>
          <div className="stats-mini-grid">
            {!metrics ? (
               <div className="stat-placeholder"><i className="fas fa-spinner fa-pulse" /> Waiting for data...</div>
            ) : (
              <>
                <div className="stat-card-modern">
                  <span className="label">Status</span>
                  <span className="value" style={{ color: '#10b981' }}>
                    <i className="fas fa-check-circle" /> Online
                  </span>
                </div>
                <div className="stat-card-modern">
                  <span className="label">Uptime</span>
                  <span className="value" style={{ fontSize: '1.1rem' }}>{uptime}</span>
                </div>
                <div className="stat-card-modern" style={{ gridColumn: 'span 2' }}>
                  <span className="label">Started At</span>
                  <span className="value" style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{startTimeStr}</span>
                </div>
                <div className="stat-card-modern">
                  <span className="label">HTTP Requests</span>
                  <span className="value" style={{ color: 'var(--accent-clr)' }}>
                    {httpStats.Requests?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="stat-card-modern">
                  <span className="label">Active Requests</span>
                  <span className="value" style={{ color: 'var(--warning-clr)' }}>
                    {httpStats.ActiveRequests || 0}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Storage & Database */}
        <div className="dashboard-group storage-group-card card-glass">
          <h3 className="group-title"><i className="fas fa-database" /> Storage & Database</h3>
          <div className="stats-mini-grid">
            {!metrics ? (
              <div className="stat-placeholder"><i className="fas fa-spinner fa-pulse" /> Waiting for data...</div>
            ) : (
              <>
                <div className="stat-card-modern" style={{ gridColumn: 'span 2' }}>
                  <span className="label">DB Storage Size</span>
                  <span className="value" style={{ color: 'var(--accent-clr)' }}>{dataSize}</span>
                </div>
                <div className="stat-card-modern" style={{ gridColumn: 'span 2' }}>
                  <span className="label">Total Games</span>
                  <span className="value">{total.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-lower-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="compact-card chart-card card-glass">
          <h3 className="group-title"><i className="fas fa-chart-line" /> Performance Chart</h3>
          <div className="chart-container">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
