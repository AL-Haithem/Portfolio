export default function Works({ onOpenAuth }) {
  return (
    <section id="works" className="section">
      <div className="container">
        <div className="reveal">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">My Works.</h2>
          <p className="section-desc">Projects I've built and experimented with.</p>
        </div>
        
        <div className="sd2-grid reveal reveal-d1" style={{ marginTop: '36px' }}>
          <div className="sd2-card" style={{ cursor: 'pointer' }} id="auth-project-card" onClick={onOpenAuth}>
            <div className="sd2-ready-badge">&#10003; Interactive Demo</div>
            <div className="sd2-title-row">
              <span className="sd2-icon">&#128274;</span>
              <div>
                <div className="sd2-title">Authentication System</div>
                <div className="sd2-subtitle">In-memory mock &mdash; watch the backend pipeline live</div>
              </div>
            </div>
            <div className="sd2-tags" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Express</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Mongoose</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Joi</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>JWT</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>bcrypt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
