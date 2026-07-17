
import Terminal from './Terminal'
import useReveal from './ui/useReveal'

export default function Hero() {
  useReveal()
  return (
    <section className="hero section" aria-labelledby="hero-h1">
      <div className="hero-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="container hero-inner">
        <div className="hero-copy reveal">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Open to opportunities
          </div>

          <h1 id="hero-h1">
            Backend Engineer<br />
            <span className="hero-h1-accent">Node.js · Express · System Design</span>
          </h1>

          <p className="hero-sub">
            I build reliable backend APIs with Node.js and Express, focusing on maintainable
            architecture, security, and production-ready development. I enjoy designing scalable
            systems and continuously improving my engineering practices.
          </p>

          <div className="hero-stack" aria-label="Core technologies">
            <span className="hero-pill"><span className="hero-pill-dot green"></span>Node.js</span>
            <span className="hero-pill"><span className="hero-pill-dot green"></span>Express.js</span>
            <span className="hero-pill"><span className="hero-pill-dot blue"></span>MongoDB</span>
            <span className="hero-pill"><span className="hero-pill-dot blue"></span>PostgreSQL</span>
            <span className="hero-pill"><span className="hero-pill-dot yellow"></span>Docker</span>
            <span className="hero-pill"><span className="hero-pill-dot yellow"></span>REST APIs</span>
          </div>

          <div className="hero-actions">
            <a className="btn btn-primary" href="https://github.com/AL-Haithem" target="_blank" rel="noopener noreferrer" id="cta-github">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a className="btn btn-outline" href="#contact" id="cta-contact">Get in touch</a>
          </div>

          <div className="hero-stats-simple">
            <span>⚡ Node.js + Express</span>
            <span className="dot-sep">•</span>
            <span>🏗️ Backend &amp; Arch</span>
            <span className="dot-sep">•</span>
            <span style={{color: 'var(--green)'}}>🎯 Open to Work</span>
            <span className="dot-sep">•</span>
            <span>📍 Indie Game Dev</span>
          </div>
        </div>

        <Terminal />
      </div>
    </section>
  )
}
