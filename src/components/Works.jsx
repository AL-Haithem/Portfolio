export default function Works({ onOpenAuth }) {
  return (
    <section id="works" className="section">
      <div className="container">
        <div className="reveal">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            My Works. 
            <span style={{ fontSize: '14px', color: 'var(--green, #4ade80)', fontWeight: 'normal', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
              💡 Click on any project below to test it live!
            </span>
          </h2>
          <p className="section-desc">Projects I've built and experimented with.</p>
        </div>
        
        <div className="sd2-grid reveal reveal-d1" style={{ marginTop: '36px' }}>
          <div className="sd2-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} id="auth-project-card" onClick={onOpenAuth}>
            <div className="sd2-ready-badge">&#10003; Interactive Demo</div>
            <div className="sd2-title-row">
              <span className="sd2-icon">&#128274;</span>
              <div>
                <div className="sd2-title">Authentication System</div>
                <div className="sd2-subtitle">Secure Auth &mdash; watch the backend pipeline live</div>
              </div>
            </div>
            <div className="sd2-tags" style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Express</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Mongoose</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Joi</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>JWT</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>bcrypt</span>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '14px', pointerEvents: 'none', background: 'var(--green, #4ade80)', color: '#000', fontWeight: 'bold' }}>
                🚀 Click Here To Test It Live
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
