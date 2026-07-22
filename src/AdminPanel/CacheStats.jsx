import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CacheStats({ isActive, metrics }) {
  const data = metrics?.Cache || null;

  if (!isActive) return null;

  return (
    <div id="cache" className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-server"></i> Redis Cache Statistics
        </h2>
      </div>

      {!data ? (
        <div className="settings-message" style={{position:'static', transform:'none', margin:'20px 0'}}>
          <i className="fas fa-spinner fa-pulse" style={{marginRight: '8px'}} /> Waiting for Cache metrics stream...
        </div>
      ) : (
        <>
          {/* Section 1 & 2: Overview and Usage */}
          <div className="dashboard-grid">
            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-chart-pie"></i> Overview
              </div>
              <div className="stats-mini-grid">
                <StatCard label="Current Storage" value={extractValue(data.current_storage, true)} />
                <StatCard label="Monthly Storage" value={extractValue(data.total_monthly_storage, true)} />
                <StatCard label="Monthly Bandwidth" value={extractValue(data.total_monthly_bandwidth, true)} />
                <StatCard label="Monthly Requests" value={extractValue(data.total_monthly_requests)} />
                <StatCard label="Daily Requests" value={extractSum(data.dailyrequests)} />
                <StatCard label="Daily Billing" value={'$' + extractSum(data.dailybilling)} />
              </div>
            </div>

            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-hdd"></i> Usage
              </div>
              <div className="stats-mini-grid">
                <StatCard label="Disk Usage" value={extractValue(data.diskusage, true)} />
                <StatCard label="Daily Bandwidth" value={extractValue(data.dailybandwidth, true)} />
                <StatCard label="Daily Requests" value={extractSum(data.dailyrequests)} />
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Traffic and Cache */}
          <div className="dashboard-grid">
            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-exchange-alt"></i> Traffic Overview
              </div>
              <div className="stats-mini-grid">
                <StatCard label="Daily Read Req." value={extractValue(data.daily_read_requests)} />
                <StatCard label="Daily Write Req." value={extractValue(data.daily_write_requests)} />
                <StatCard label="Monthly Read Req." value={extractValue(data.total_monthly_read_requests)} />
                <StatCard label="Monthly Write Req." value={extractValue(data.total_monthly_write_requests)} />
              </div>
            </div>

            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-chart-area"></i> Traffic History
              </div>
              <div style={{ width: '100%', height: '160px', marginTop: '10px' }}>
                <TimeSeriesChart data={data.dailyrequests} color="#00f2fe" name="Requests" />
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card-glass dashboard-group" style={{ gridColumn: 'span 2' }}>
              <div className="group-title">
                <i className="fas fa-bolt"></i> Cache Hit Rates (Over Time)
              </div>
              <div className="stats-mini-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                  <div className="rates-section-title">Hits/sec</div>
                  <div style={{ height: '120px' }}><TimeSeriesChart data={data.hits} color="#10b981" name="Hits" /></div>
                </div>
                <div>
                  <div className="rates-section-title">Misses/sec</div>
                  <div style={{ height: '120px' }}><TimeSeriesChart data={data.misses} color="#f87171" name="Misses" /></div>
                </div>
                <div>
                  <div className="rates-section-title">Reads/sec</div>
                  <div style={{ height: '120px' }}><TimeSeriesChart data={data.read} color="#38bdf8" name="Reads" /></div>
                </div>
                <div>
                  <div className="rates-section-title">Writes/sec</div>
                  <div style={{ height: '120px' }}><TimeSeriesChart data={data.write} color="#fbbf24" name="Writes" /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 & 6: Database and Commands */}
          <div className="dashboard-grid">
            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-database"></i> Database Keys
              </div>
              <div className="stats-mini-grid">
                <StatCard label="Keyspace" value={extractValue(data.keyspace)} />
                <StatCard label="Active Connections" value={extractValue(data.connection_count)} />
                <StatCard label="REST Connections" value={extractValue(data.rest_conn_count)} />
              </div>
            </div>

            <div className="card-glass dashboard-group">
              <div className="group-title">
                <i className="fas fa-terminal"></i> Commands
              </div>
              <div className="stats-mini-grid" style={{ gridTemplateColumns: '1fr' }}>
                <StatCard label="Daily Net Commands" value={extractValue(data.daily_net_commands)} />
                
                {Array.isArray(data.command_counts) && data.command_counts.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div className="group-title" style={{ fontSize: '0.85rem', marginBottom: '8px', borderBottom: 'none' }}>Command Breakdown</div>
                    <div className="stats-mini-grid">
                      {data.command_counts.map((cmdObj, i) => (
                        <div key={i} className="stat-card-modern">
                          <span className="label" style={{ textTransform: 'uppercase' }}>{cmdObj.metric_identifier || 'CMD'}</span>
                          <span className="value" style={{ fontSize: '1rem' }}>{extractValue(cmdObj.data_points)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function extractValue(val, isBytes = false) {
  let num = 0
  if (typeof val === 'number') {
    num = val
  } else if (Array.isArray(val) && val.length > 0) {
    const last = val[val.length - 1]
    if (last && typeof last.y === 'number') num = last.y
  } else if (typeof val === 'string') {
    num = parseFloat(val) || 0
  }

  if (isBytes) {
    if (num === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(num) / Math.log(k))
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(2)).toString()
}

function extractSum(val) {
  if (typeof val === 'number') return val.toString()
  if (!Array.isArray(val)) return '0'
  const sum = val.reduce((acc, curr) => acc + (curr.y || 0), 0)
  return Number.isInteger(sum) ? sum.toString() : parseFloat(sum.toFixed(2)).toString()
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card-modern">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  )
}

function TimeSeriesChart({ data, color, name }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No data</div>
  }

  const parsedData = data.map(d => {
    let shortTime = d.x;
    try {
      if (d.x.includes(' ')) {
        const timePart = d.x.split(' ')[1]; // "13:44:00.000"
        shortTime = timePart.split('.')[0]; // "13:44:00"
      }
    } catch(e) {}
    return { ...d, time: shortTime, value: typeof d.y === 'number' ? Number(d.y.toFixed(2)) : 0 }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={parsedData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`color${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area type="monotone" dataKey="value" name={name} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${name})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
