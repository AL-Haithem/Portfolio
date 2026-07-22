import { useState } from 'react';
import adminImages from '../data/lootAdminImages.json';

export default function Works({ onOpenAuth }) {
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const scrollGallery = (id, direction) => {
    const el = document.getElementById(`gallery-${id}`);
    if (el) {
      const scrollAmount = el.clientWidth;
      const currentScroll = Math.ceil(el.scrollLeft);
      const maxScroll = el.scrollWidth - el.clientWidth;
      
      if (direction === 'right') {
        if (currentScroll >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (currentScroll <= 10) {
          el.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

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
        <div className="auth-modal" style={{ zIndex: 9999 }}>
          <style>{`
            .admin-gallery-scroll::-webkit-scrollbar { display: none; }
            .admin-gallery-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <div className="auth-modal-content" style={{ maxWidth: '900px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            <button className="auth-modal-close" onClick={() => setAdminModalOpen(false)}>&times;</button>
            <h2 style={{ marginBottom: '20px', color: 'var(--green, #4ade80)' }}>📸 Loot Store Admin Panel</h2>
            <p style={{ marginBottom: '20px', color: '#aaa', fontSize: '14px' }}>
              Since the admin panel is private and contains sensitive data, here is a showcase of its fully automated dashboard, pricing controls, and analytics.
            </p>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {adminImages.map((image) => (
                <div key={image.id} style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  
                  {/* Image Gallery Container */}
                  <div style={{ position: 'relative' }}>
                    {image.urls && image.urls.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); scrollGallery(image.id, 'left'); }}
                          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: '0.2s' }}>
                          &#10094;
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); scrollGallery(image.id, 'right'); }}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: '0.2s' }}>
                          &#10095;
                        </button>
                      </>
                    )}
                    <div id={`gallery-${image.id}`} style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }} className="admin-gallery-scroll">
                      {image.urls && image.urls.map((url, idx) => (
                        <img key={idx} src={url} alt={`${image.title} - ${idx + 1}`} style={{ minWidth: '100%', width: '100%', scrollSnapAlign: 'start', display: 'block', objectFit: 'cover' }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{image.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{image.description}</p>
                    {image.urls && image.urls.length > 1 && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#555', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>↔️</span> Click the arrows or swipe to see more images ({image.urls.length} images)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
