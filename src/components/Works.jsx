import { useState } from 'react';

export default function Works({ onOpenAuth }) {
  const [adminModalOpen, setAdminModalOpen] = useState(false);

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
          {/* Auth System Project */}
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

          {/* Loot Store Project */}
          <div className="sd2-card" style={{ display: 'flex', flexDirection: 'column' }} id="loot-project-card">
            <div className="sd2-ready-badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>&#128187; E-Commerce</div>
            <div className="sd2-title-row">
              <span className="sd2-icon">&#127918;</span>
              <div>
                <div className="sd2-title">Loot Store</div>
                <div className="sd2-subtitle">Automated games & entertainment store with custom Admin Panel</div>
              </div>
            </div>
            <div className="sd2-tags" style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Node.js</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Own Admin Panel</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Automated Pricing</span>
              <span className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#9aabb8'}}>Web Crawler</span>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
              <a href="https://loot.alhaithem.site" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px', textAlign: 'center', textDecoration: 'none', background: 'var(--green, #4ade80)', color: '#000', fontWeight: 'bold' }}>
                🌍 Visit Store
              </a>
              <button onClick={() => setAdminModalOpen(true)} className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: '13px', color: '#eab308', borderColor: '#eab308' }}>
                📸 View Admin Panel
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Panel Images Modal */}
      {adminModalOpen && (
        <div className="auth-modal" style={{ zIndex: 9999 }} onClick={() => setAdminModalOpen(false)}>
          <div className="auth-modal-content" style={{ maxWidth: '900px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }} onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setAdminModalOpen(false)}>&times;</button>
            <h2 style={{ marginBottom: '20px', color: 'var(--green, #4ade80)' }}>📸 Loot Store Admin Panel</h2>
            <p style={{ marginBottom: '20px', color: '#aaa', fontSize: '14px' }}>
              Since the admin panel is private and contains sensitive data, here is a showcase of its fully automated dashboard, pricing controls, and analytics.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Video Player */}
              <div style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <video 
                  src="https://res.cloudinary.com/b6ztyqia/video/upload/v1784733679/2026-07-22_16-17-43_as9nxw.mp4" 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  style={{ width: '100%', display: 'block' }} 
                />
              </div>

              {/* Sections Description */}
              <div style={{ background: '#111', borderRadius: '10px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--green, #4ade80)' }}>Admin Panel Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-chart-pie" style={{marginRight: '8px', color: '#9aabb8'}}></i>Dashboard</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Main analytics, sales overview, and quick stats.</p>
                  </div>
                  
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-microchip" style={{marginRight: '8px', color: '#9aabb8'}}></i>System</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Real-time server health and SSE monitoring metrics.</p>
                  </div>

                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-robot" style={{marginRight: '8px', color: '#9aabb8'}}></i>Data Crawler</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Automated game catalog extraction and auto-pricing.</p>
                  </div>

                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-server" style={{marginRight: '8px', color: '#9aabb8'}}></i>Cache Memory</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Redis cache management and performance stats.</p>
                  </div>

                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-database" style={{marginRight: '8px', color: '#9aabb8'}}></i>Data Management</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Direct database control for products and orders.</p>
                  </div>

                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}><i className="fas fa-history" style={{marginRight: '8px', color: '#9aabb8'}}></i>Logs & Settings</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>System activity logs, error tracking, and global configs.</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  )
}
