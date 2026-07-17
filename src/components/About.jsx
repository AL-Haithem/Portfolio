import { useState } from 'react'
import useReveal from './ui/useReveal'

export default function About() {
  useReveal()
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <h2 id="about-title" className="section-title reveal reveal-d1">About Me</h2>

        <div className="about-grid reveal reveal-d2" style={{ marginTop: '36px' }}>
          <div>
            <p className="section-desc" style={{ marginBottom: '16px' }}>
              Game developer turned Backend Engineer.
            </p>
            <p className="section-desc" style={{ marginBottom: '16px' }}>
              Today, I focus on backend engineering with <strong>Node.js</strong> and <strong>Express</strong>, building secure APIs, designing maintainable architectures, and continuously expanding my knowledge of scalable systems and modern backend technologies.
            </p>
            
            {expanded && (
              <div className="about-more-text animate-in">
                <p className="section-desc" style={{ marginBottom: '16px' }}>
                  My journey started in multiplayer game development, where I learned to design
                  interconnected systems, manage client/server communication, and solve complex problems independently.
                </p>
                <p className="section-desc" style={{ marginBottom: '24px' }}>
                  I'm currently looking for opportunities to contribute to real products, learn from experienced engineers, and grow within a strong engineering team.
                </p>
              </div>
            )}
            
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="btn btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {expanded ? 'Show Less' : 'Read More...'}
            </button>

            <div className="about-traits reveal reveal-d1" style={{ marginTop: '24px' }}>
              <span className="trait-badge"><span className="trait-icon">🎮</span>Game Dev Roots</span>
              <span className="trait-badge"><span className="trait-icon">🧠</span>Systems Thinker</span>
              <span className="trait-badge"><span className="trait-icon">🚀</span>Fast Learner</span>
              <span className="trait-badge"><span className="trait-icon">📐</span>Architecture Focused</span>
              <span className="trait-badge"><span className="trait-icon">🌱</span>Always Growing</span>
              <span className="trait-badge"><span className="trait-icon">🤝</span>Team Player</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
